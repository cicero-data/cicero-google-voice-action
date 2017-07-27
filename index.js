/*jshint esversion: 6 */

exports.handler = (event, context, callback) => {
    var response = 'Hello webhook world!';
    var requestData = event.body;
    console.log(requestData);
    callback(null, {statusCode: 200,
                    isBase64Encoded: false,
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({'speech': response, 'displayText': response })
    });
};
