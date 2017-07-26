/*jshint esversion: 6 */

exports.handler = (event, context, callback) => {
    response = 'Hello webhook world!';
    callback(null, {statusCode: 200,
                    isBase64Encoded: false,
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({'speech': response, 'displayText': response })
    });
};
