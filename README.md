# cicero-google-voice-action
Google Voice action assistant that uses the Cicero API to find and contact elected officials.

Deployed as a webhook on AWS Lambda.

## Installation

This is a Node.js project that uses Docker and Serverless for testing outside of AWS.

 - Install Serverless: `npm install serverless -g`
 - Pull the docker image for serverless offline: `docker pull lambci/lambda`
 - Install npm packages: `npm install`


## Running locally

First, set up the constants file:
 - `cp lambda/constants.js.example lambda/constants.js`
 - Edit `lambda/constants.js` to set your Cicero API key

To run the local server, use `./server.sh`. It will be available at http://localhost:3000.
