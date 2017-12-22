// This is a shim for the request object from express (https://github.com/expressjs/express/blob/master/lib/request.js) because the
// actions-on-google module assumes it is working with an express request object.
// Based on: https://github.com/bradyholt/google-action-tiger/blob/master/lambda-function/assistantRequest.js

function AssistantRequest(lambda_event) {
    'use strict';
    this.body = JSON.parse(lambda_event.body);
}

AssistantRequest.prototype.get = function get(value) {
    'use strict';
    return null;
};

module.exports = AssistantRequest;
