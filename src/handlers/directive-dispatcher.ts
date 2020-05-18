import { AlexaResponse, DiscoveryDirective, ErrorResponse, EndpointDirective } from "alexa-smarthome-ts";
import { DiscoveryHandler } from "./discovery-handler";
import { EndpointDirectiveHandler, SmartHomeDirective } from "./directive-handler";
import { v4 as uuidv4 } from "uuid";
import { Logger, createLogger, format, transports } from "winston";


export class DirectiveHandlerDispatcher {

    private readonly logger: Logger = createLogger({
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        transports: [new transports.Console()]
    });

    private discoveryHandler: DiscoveryHandler;
    private endpointDirectiveHandlers: EndpointDirectiveHandler<any, any>[];

    constructor(discoveryHandler: DiscoveryHandler, endpointDirectiveHandlers: EndpointDirectiveHandler<any, any>[]) {
        this.discoveryHandler = discoveryHandler;
        this.endpointDirectiveHandlers = endpointDirectiveHandlers;
    }

    public async handle(directive: SmartHomeDirective, context: any): Promise<AlexaResponse | ErrorResponse> {
        if (this.isDiscoveryDirective(directive)) {
            this.logger.info("Dispatching discovery directive");
            return this.discoveryHandler.handle(directive);
        }
        for (const handler of this.endpointDirectiveHandlers) {
            if (handler.canHandle(directive)) {
                this.logger.info(`Dispatching directive ${directive.directive.header.name}`);
                return handler.handle(directive);
            }
        }
        this.logger.error(`No handlers were found for the directive ${directive.directive.header.name}`);
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
