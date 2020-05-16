import { AlexaResponse, DiscoveryDirective, ErrorResponse, EndpointDirective } from "alexa-smarthome-ts";
import { DiscoveryHandler } from "./discovery-handler";
import { EndpointDirectiveHandler, SmartHomeDirective } from "./directive-handler";
import { v4 as uuidv4 } from "uuid";

/**
 * Lambda handler.
 */
export class DirectiveHandlerDispatcher {

    private discoveryHandler: DiscoveryHandler;
    private endpointDirectiveHandlers: EndpointDirectiveHandler<any, any>[];

    constructor(discoveryHandler: DiscoveryHandler, endpointDirectiveHandlers: EndpointDirectiveHandler<any, any>[]) {
        this.discoveryHandler = discoveryHandler;
        this.endpointDirectiveHandlers = endpointDirectiveHandlers;
    }

    public async handle(directive: SmartHomeDirective, context: any): Promise<AlexaResponse | ErrorResponse> {
        if (this.isDiscoveryDirective(directive)) {
            return this.discoveryHandler.handle(directive);
        }
        for (const handler of this.endpointDirectiveHandlers) {
            if (handler.canHandle(directive)) {
                return handler.handle(directive);
            }
        }
        return this.buildErrorResponse(directive);
    }

    private isDiscoveryDirective(directive: SmartHomeDirective): directive is DiscoveryDirective {
        return directive.directive.header.namespace === 'Alexa.Discovery';
    }

    private buildErrorResponse(directive: EndpointDirective<any, any>): ErrorResponse {
        return {
            "event": {
                "header": {
                    "namespace": "Alexa",
                    "name": "ErrorResponse",
                    "messageId": uuidv4(),
                    "payloadVersion": "3"
                },
                // @ts-ignore
                "endpoint": {
                    "endpointId": directive.directive.endpoint.endpointId
                },
                "payload": {
                    "type": "ENDPOINT_UNREACHABLE",
                    "message": "No handlers could handle the directive"
                }
            }
        };
    }
}
