const path = require('path');
const moment = require('moment');
// const urllib = require('urllib');
const axios = require('axios').default;

const pkg = require(path.join(__dirname, '..', 'package.json'));

module.exports = function (RED) {
    RED.log.info('apple-findme-reloaded version: ' + pkg.version);

    const ApiEndpointUrl = 'https://fmipmobile.icloud.com/fmipservice/device/';

    /**
     * AppleFindMeAccountNode class
     */
    class AppleFindMeAccountNode {
        /**
         * Create a new account node
         * @class
         * @param {object} config 
         */
        constructor(config) {
            RED.nodes.createNode(this, config);
            var node = this;

            this.name = config.name;
            this.username = config.username;
            this.password = config.password;

            this.apiThrottleLimit = Number.parseInt(config.apiThrottleLimit, 10);
            this.requestTimeout = Number.parseInt(config.requestTimeout, 10);

            this.lastRequestDevices = { err: null, data: null, res: null, cached: false, time: moment('19000101', 'YYYYMMDD') };

            this.requestHeader = {
                'Accept-Language': 'de-DE',
                'User-Agent': 'FindMyiPhone/500 CFNetwork/758.4.3 Darwin/15.5.0',
                'X-Apple-Realm-Support': '1.0',
                'X-Apple-AuthScheme': 'UserIDGuest',
                'X-Apple-Find-API-Ver': '3.0'
            };
        }

        /**
         * Refresh the auth header with actual data
         * @private
         */
        _setAuthHeader() {
            this.requestHeader['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
        }

        /**
         * Request data from Apple endpoint, if not throttled. Otherwise return cached data.
         * @async
         * @returns {object} 
         */
        /*async*/ requestDevices() {
            // check if throttled
            if (moment().diff(this.lastRequestDevices.time) < this.apiThrottleLimit * 1000) {
                let req = this.lastRequestDevices;
                req.cached = true;

                return req;
            }

            // otherwise
            this._setAuthHeader();
            var node = this;

            const req = axios.create({
                baseURL: ApiEndpointUrl + this.username + '/initClient',
                method: 'post',
                timeout: this.requestTimeout * 1000,
                headers: this.requestHeader,
            });

            try {
                req.post().then(res => {
                    node.send(res);
                });
            }
            catch (e) {
                node.warn(e);
            }

            return 0;
            
            // let req = new Promise(rtn => {
            //     urllib.request(ApiEndpointUrl + this.username + '/initClient', {
            //         method: 'POST',
            //         dataType: 'json',
            //         headers: this.requestHeader,
            //         content: '',
            //         rejectUnauthorized: false,
            //         timeout: 5000,
            //     }, function (err, data, res) {
            //         err ||= res.statusCode != 200;

            //         if (!err)
            //             node.lastRequestDevices = {
            //                 err: err,
            //                 data: data,
            //                 res: res,
            //                 cached: false,
            //                 time: moment(Date.now()),
            //             };
            //         else
            //             node.lastRequestDevices = {
            //                 err: err,
            //                 data: node.lastRequestDevices.data || data,
            //                 res: res,
            //                 cached: true,
            //                 time: moment(Date.now()),
            //             };
                    
            //         rtn(node.lastRequestDevices);
            //     });
            // });

            // return await req;
        }
    }

    // register node
    RED.nodes.registerType('apple-findme-account', AppleFindMeAccountNode);
}