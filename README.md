# webir-alexa
Alexa skill that connects to a [WebIR](https://github.com/jbujalance/webir) server so that it can controls any managed IR device.

## Architecture
The skill is hosted on an Amazon Lambda.
The entry point of the Skill is the handler of the lambda, which can be found in the [app.ts](./src/app.ts) file. This entry point is a directive dispatcher which redirects the received Alexa directive to the correct directive handler. There is a directive handlere for each supported Alexa directive, and the handlers must be registererd on the dispatcher in the [app.ts](./src/app.ts). The handlers can be found in the [handlers](./src/handlers) directory.

Each directive handler will make the corresponding requests to the WebIR server, sending the expected codes to it so that the WebIR server can send the corresponding commands to the LIRC daemon. The location of the WebIR server has to be configured as an environment variable on the AWS Lambda:
* `WEBIR_URL`: The URL of the WebIR server that will handle the requests and pass the commands to the LIRC daemon. For example: `http://webir.mydomain.com`

## Continuous deployment
The skill is built and deployed to AWS Lambda on every push to master. See the [Github Action](./.github/workflows/main.yml) for more detials.

I order for GitHub to be able to deploy the code to the AWS Lambda, a user must be created in the AWS IAM with the policy `AWSLambdaFullAccess`. This user has an access key id and a secret access key id, that need to be added to the GitHub repository's secrets, under the following variable names:
* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`