exports.handler = (event, context, callback) => {
    'use strict';

    process.env.DEBUG = 'actions-on-google:*';
    const AssistantRequest = require('./assistant-request');
    const AssistantResponse = require('./assistant-response');
    const ApiAiApp = require('actions-on-google').ApiAiApp;

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
                console.log(deviceCoordinates);
                app.tell(`<speak>Yay! I know where you are now!</speak>`);
            } else {
                console.error(permission);
                app.tell(`<speak>Oops! I broke. I don't know what that permission is.</speak>`);
            }
        } else {
            app.tell(`<speak>I can't find your representatives unless I know where to look. \
                     If you are willing to grant permission later, please ask again.</speak>`);
        }
    }

    function unhandledDeepLinks(app) {
        app.ask(`Sorry, but I didn't know what to make of \
        ${app.getRawInput()}. \
        <break time="1s"/> \
        You can try asking me to find your representatives instead.`);
    }

    // build app object
    let response = new AssistantResponse();
    let request = new AssistantRequest(event);
    const app = new ApiAiApp({request, response});

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
