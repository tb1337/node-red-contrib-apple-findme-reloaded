const moment = require('moment');

module.exports = function (RED) {
    /**
     * AppleFindMeRequestNode class
     */
    class AppleFindMeRequestNode {
        /**
         * Create a new request node
         * @class
         * @param {object} config 
         * @returns {void}
         */
        constructor(config) {
            RED.nodes.createNode(this, config);
            var node = this;

            this.account = RED.nodes.getNode(config.account);
            this.destKey = config.destKey;

            // No processing if no account is set
            if (!this.account) {
                return;
            }

            this.on('input', async (msg, send, done) => {
                this.status({ fill: "yellow", shape: "dot", text: "Requesting data..." });
                
                let res = msg._debug;
                delete msg._debug;
                if (!res)
                    res = this.account.requestDevices();
                    // res = await this.account.requestDevices();

                // msg[this.destKey == '' ? 'payload' : this.destKey] = this._handleResponse(res);
                
                node.send(msg);
            });
        }

        /**
         * Handle response and set node status, return pretty payload
         * @private
         * @param {object} res 
         * @returns {object}
         */
        _handleResponse(res) {
            let fill = "blue";
            let shape = "dot";
            let text = "";

            let data = this._createPayload(res.data, res.cached, res.time);

            if (res.err) {
                fill = "red";

                switch (res.res.statusCode) {
                    case 401:
                        text = `Not authorized (${res.res.statusCode})`;
                        break;
                    case 403:
                        text = `Forbidden (${res.res.statusCode})`;
                        break;
                    case 404:
                        text = `Not found (${res.res.statusCode})`;
                        break;
                    default:
                        text = `Unknown error (${res.res.statusCode})`;
                }

                this.status({ fill: fill, shape: shape, text: text });
            }
            else {
                text = `${Object.keys(data.devices).length} devices`;
                this.status({ fill: fill, shape: shape, text: text });
            }

            return data;
        }

        /**
         * Create pretty payload and model the data slightly
         * @private
         * @param {object} data 
         * @param {boolean} cached 
         * @param {moment} time 
         * @returns {object}
         */
        _createPayload(data, cached, time) {
            let o = {
                isCached: cached,
                requestTime: time,
                byModel: {},
                byName: {},
                devices: {},
            };

            if (data.content && typeof (data.content) == 'object') {
                data.content.forEach((i) => {
                    let d = this._generateDataModel(i, data.serverContext);
                    o.devices[i.id] = d;
                
                    if (!o.byModel[d.modelName])
                        o.byModel[d.modelName] = [];
                    o.byModel[d.modelName].push(d);

                    o.byName[d.name] = d;
                });
            }

            return o;
        }

        /**
         * Generate and fill model with data from Apple payload
         * @private
         * @param {object} item 
         * @param {object} context 
         * @returns {object}
         */
        _generateDataModel(item, context) {
            let image_link = `${context.imageBaseUrl}/fmipmobile/deviceImages-9.0/${item.deviceClass}/${item.rawDeviceModel}-${item.deviceColor}`;

            let r = {
                id: item.id,
                name: item.name,
                modelName: item.modelDisplayName == "Accessory" ? item.deviceDisplayName : item.modelDisplayName,
                className: item.deviceClass,
                deviceName: item.deviceDisplayName,
                rawName: item.rawDeviceModel,
                uuid: item.baUUID,
                discoveryId: item.deviceDiscoveryId,
                battery: {
                    level: item.batteryLevel,
                    status: item.batteryStatus,
                    isCharging: item.batteryStatus != "NotCharging",
                    isDraining: item.batteryStatus == "NotCharging",
                },
                resources: {
                    smallImage: `${image_link}/online-infobox.png`,
                    mediumImage: `${image_link}/online-infobox__2x.png`,
                    largeImage: `${image_link}/online-infobox__3x.png`,
                },
                hasLocation: false,
                location: null,
            };

            // is not always set
            if (item.location && typeof (item.location) == "object") {
                r.hasLocation = true;
                
                r.location = {
                    latitude: item.location.latitude,
                    longitude: item.location.longitude,
                    horizontalAccuracy: item.location.horizontalAccuracy,
                    altitude: item.location.altitude,
                    verticalAccuracy: item.location.verticalAccuracy,
                    positionType: item.location.positionType,
                    isOld: item.location.isOld,
                    isInaccurate: item.location.isInaccurate,
                    lastUpdated: moment.utc(item.location.timeStamp).local(),
                };
            }

            return r;
        }
    }

    // register node
    RED.nodes.registerType('apple-findme-request', AppleFindMeRequestNode);
};