import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";

/**
 * Lambda handler.
 */
export class Handler {

    public async handle(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
        const response = {
            statusCode: 200,
            body: JSON.stringify('If I am right, this should work :)'),
        };
        return response;
    }
}
