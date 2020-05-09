import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";

/**
 * Lambda handler.
 */
export class Handler {

    public async handle(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
        console.log(`event: ${JSON.stringify(event)}`);
        console.log(`context: ${JSON.stringify(context)}`);
        const response = {
            statusCode: 200,
            body: JSON.stringify('If I am right, this should work :)'),
        };
        return response;
    }
}
