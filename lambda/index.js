exports.handler = (event, context) => {
    'use strict';

    process.env.DEBUG = 'actions-on-google:*';
    const AssistantRequest = require('./assistant-request');
    const AssistantResponse = require('./assistant-response');
    const CICERO_API_KEY = require('./constants');
    const ApiAiApp = require('actions-on-google').ApiAiApp;
    const request = require('request');

    // API.AI actions
    const FIND_REPRESENTATIVES_ACTION = 'find_representatives';
    const REQUEST_LOC_PERMISSION_ACTION = 'request_location_permission';
    const UNHANDLED_DEEP_LINK_ACTION = 'deeplink.unknown';

    /**
     * Return response in format expected by AWS Lambda
     */
    function returnResponse() {
        let responseObj = {
            statusCode: response.statusCode,
            headers: {
                'Content-Type': 'application/json',
                'Google-Assistant-API-Version': '2'
            },
            body: JSON.stringify(response.body)
        };

        context.succeed(responseObj);
    }

    function queryCicero(lat, lon) {
        // query Cicero for officials representing a given location
        console.log('query Cicero...');
        var ciceroApiKey = CICERO_API_KEY;
        var url = ['https://staging.cicero.azavea.com/v3.1/official?lat=',
            lat,
            '&lon=',
            lon,
            '&key=',
            ciceroApiKey].join('');

        request(url, function(error, response, body) {
            if (error) {
                console.error(error);
                return;
            }
            if (response && response.statusCode) {
                console.log('status: ' + response.statusCode);
                if (response.statusCode != 200) {
                    return;
                }
            } else {
                console.error('no status code on response');
                return;
            }

            body = JSON.parse(body);

            if (!body || !body.response || !body.response.results || !body.response.results.officials) {
                console.error('response has unexpected results');
                console.error(body);
                return;
            }

            let officials = body.response.results.officials;
            if (officials.length === 0) {
                console.log('no officials found');
                return;
            }

            console.log('found officials! : ' + officials.length);
        });
    }

    function requestLocationPermission(app) {
        console.log('request permission');
        let permission = app.SupportedPermissions.DEVICE_PRECISE_LOCATION;
        app.data.permission = permission;
        console.log(permission);
        app.askForPermission('To find your representatives', permission);
    }

    function findRepresentatives(app) {
        if (app.isPermissionGranted()) {
            let permission = app.data.permission;
            if (permission === app.SupportedPermissions.DEVICE_PRECISE_LOCATION) {
                let deviceCoordinates = app.getDeviceLocation().coordinates;
                // object with latitude and longitude properties
                console.log(deviceCoordinates);
                app.tell('<speak>Yay! I know where you are now!</speak>');
            } else {
                console.error(permission);
                app.tell('<speak>Oops! I broke. I don\'t know what that permission is.</speak>');
            }
        } else {
            app.tell('<speak>I can\'t find your representatives unless I know where to look. \
                     If you are willing to grant permission later, please ask again.</speak>');
        }
    }

    function unhandledDeepLinks(app) {
        app.ask(`Sorry, but I didn't know what to make of \
        ${app.getRawInput()}. \
        <break time="1s"/> \
        You can try asking me to find your representatives instead.`);
    }

    // TODO: remove this test function call
    queryCicero(61.19, -149.9);

    // build app object
    let response = new AssistantResponse();
    let assistantRequest = new AssistantRequest(event);
    const app = new ApiAiApp({assistantRequest, response});

    let hasScreen = app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT);
    console.log('device has screen: ' + hasScreen);

    // map actions to their handler functions
    let actionMap = new Map();
    actionMap.set(UNHANDLED_DEEP_LINK_ACTION, unhandledDeepLinks);
    actionMap.set(REQUEST_LOC_PERMISSION_ACTION, requestLocationPermission);
    actionMap.set(FIND_REPRESENTATIVES_ACTION, findRepresentatives);

    app.handleRequest(actionMap);
    returnResponse();
};
