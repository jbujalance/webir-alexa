import { RequestHandler, HandlerInput } from "ask-sdk";
import { Response, Request } from "ask-sdk-model"

export class DiscoveryHandler implements RequestHandler {
    canHandle(input: HandlerInput): boolean {
        const request: Request = input.requestEnvelope.request;
        throw new Error("Method not implemented.");
    }
    handle(input: HandlerInput): Response {
        throw new Error("Method not implemented.");
    }

}