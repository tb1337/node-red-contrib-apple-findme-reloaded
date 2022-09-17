# node-red-contrib-apple-findme-reloaded

This is an alternate, much simpler, Apple FindMe node without bloat and API requests to third-party endpoints. FindMe-Reloaded only requests the _official_ Apple API endpoints and does **NOT** request OpenStreetMap or other services, to prevent them track you. In addition, little transformation of data is done, to keep data clean and simple.

Apple currently provides no altitude information. FindMe-Reloaded won't ever try to _fix_ that.

## Example payload

```javascript
{
    "isCached": false,
    "requestTime": "2022-09-17T18:48:08.803Z",
    "byModel": {
        "iPhone": [
            {
                "id": "I42Hwv9ZJncHtTXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "name": "iPhone von 사장님",
                "modelName": "iPhone",
                "className": "iPhone",
                "deviceName": "iPhone 14 Pro Max",
                "rawName": "iPhone15,3",
                "uuid": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                "discoveryId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                "battery": {
                    "level": 0.25999999046325684,
                    "status": "NotCharging",
                    "isCharging": false, // field provided by FindMe-Reloaded, makes life easier
                    "isDraining": true // field provided by FindMe-Reloaded, makes life easier
                },
                "resources": {
                    "smallImage": "https://statici.icloud.com/fmipmobile/deviceImages-9.0/iPhone/iPhone15,3-1-17-0/online-infobox.png",
                    "mediumImage": "https://statici.icloud.com/fmipmobile/deviceImages-9.0/iPhone/iPhone15,3-1-17-0/online-infobox__2x.png",
                    "largeImage": "https://statici.icloud.com/fmipmobile/deviceImages-9.0/iPhone/iPhone15,3-1-17-0/online-infobox__3x.png"
                },
                "hasLocation": true,
                "location": {
                    "latitude": 13.00000633701766,
                    "longitude": 37.000090778518228,
                    "horizontalAccuracy": 8.00001004653239,
                    "altitude": 0, // always 0, Apple isn't delivering values here
                    "verticalAccuracy": 0, // always 0, Apple isn't delivering values here
                    "positionType": "GPS",
                    "isOld": false,
                    "isInaccurate": false,
                    "lastUpdated": "2022-09-17T18:48:07.174Z"
                }
            }
        ],
        "MacBook Pro": [
            ...
        ],
        "Apple Watch": [
            ...
        ],
        "AirPods Pro": [
            ...
        ],
        "iPad": [
            ...
        ]
    },
    "byName": {
        "iPhone von 사장님": {
            // reference to object above
        },
        "MacBook Pro von 사장님": {
            ...
        },
        "Apple Watch von 사장님": {
            ...
        },
        "AirPods Pro von 사장님": {
            ...
        },
        "iPad von 사장님": {
            ...
        }
    },
    "devices": {
        "I42Hwv9ZJncHtTXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX": {
            // reference to object above
        },
        "8uzc8JI8GEWHEYlXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX": {
            ...
        },
        "QkKnPAD4ajEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX": {
            ...
        },
        "Valiig13uowd78oF5iKPGAhYIxnHh4TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX": {
            ...
        },
        "uY4SLjrRXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX": {
            ...
        }
    }
}
```
