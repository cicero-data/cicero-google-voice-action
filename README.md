# cicero-google-voice-action
Google Voice action assistant that uses the Cicero API to find and contact elected officials.

Deployed as a webhook on AWS Lambda.

## Installation

This is a Node.js project that uses Docker and Serverless for testing outside of AWS.
Locally, it runs within a vagrant box.

Dependencies:
 - Vagrant 1.9+

Installation:
 - Set constants: `cp deployment/ansible/group_vars/all.example deployment/ansible/group_vars/all`
 - Edit the `all` group vars file copied in the last step to set API keys and webhook URL
 - Create the vagrant box: `vagrant up`
 - Connect to the vagrant box: `vagrant ssh`
 - Start the local server running with `./scripts/server`

It will be available at http://localhost:3000.

Deployment:
 - `vagrant ssh`
 - Set AWS environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
 - `sls deploy` to deploy the Lambda function
 - Note the API key `ciceroGoogleVoice` in the output
 - Note the POST endpoint in the output
 - Edit `deployment/ansible/group_vars/all` to set the webhook endpoint and API key to the above
 - Exit the VM and `vagrant provision` to update the Dialogflow configuration for the above
 - Zip the contents of the `dialogflow` directory and upload to Dialogflow, or alternatively:
 - Update the fulfillment URL and `x-api-key` header in Dialogflow directly, if only webhook changed
