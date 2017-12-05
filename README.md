# cicero-google-voice-action
Google Voice action assistant that uses the Cicero API to find and contact elected officials.

Deployed as a webhook on AWS Lambda.

## Installation

This is a Node.js project that uses Docker and Serverless for testing outside of AWS.
Locally, it runs within a vagrant box.

Dependencies:
 - Vagrant 1.9+

 - Set constants: `cp deployment/ansible/group_vars/all.example deployment/ansible/group_vars/all`
 - Edit the `all` group vars file copied in the last step to set API keys and webhook URL
 - Create the vagrant box: `vagrant up`
 - Connect to the vagrant box: `vagrant ssh`
 - Start the local server running with `./scripts/server`

It will be available at http://localhost:3000.
