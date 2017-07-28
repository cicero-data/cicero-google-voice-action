// This is a shim for the response object from express (https://github.com/expressjs/express/blob/master/lib/response.js) because the
// actions-on-google module assumes it is working with an express response object.
// Based on: https://github.com/bradyholt/google-action-tiger/blob/master/lambda-function/assistantRequest.js

function AssistantResponse() {
    'use strict';
    this.headers = {};
}

AssistantResponse.prototype.status = function status(code) {
    'use strict';
    this.statusCode = code;
    return this;
};

AssistantResponse.prototype.send = function send(body) {
    'use strict';
    this.body = body;
    return this;
};

AssistantResponse.prototype.append = function append(field, val) {
    'use strict';
    this.headers[field] = val;
    return this;
};

AssistantResponse.prototype.get = function get(field) {
    'use strict';
    return this.headers[field];
};

module.exports = AssistantResponse;