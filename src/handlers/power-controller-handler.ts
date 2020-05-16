import { TurnOn, TurnOff, ResponseEvent, POWER_CONTROLLER, ErrorResponse } from "alexa-smarthome-ts";
import { EndpointDirectiveHandler } from "./directive-handler";
import { WebIrClient } from "../webir-client";
import { v4 as uuidv4 } from "uuid";
import { Logger, createLogger, format, transports } from "winston";
import { AxiosError } from "axios";

declare type PowerControllerDirective = TurnOn | TurnOff;

export class PowerControllerHandler implements EndpointDirectiveHandler<PowerControllerDirective, ResponseEvent<"Alexa.PowerController">> {

    private readonly logger: Logger = createLogger({
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        transports: [new transports.Console()]
    });
    private readonly POWER_CODE = "KEY_POWER";
    private webIrClient: WebIrClient;

    constructor(webIrClient: WebIrClient) {
        this.webIrClient = webIrClient;
    }

    canHandle(directive: PowerControllerDirective): boolean {
        return directive.directive.header.namespace === POWER_CONTROLLER;
    }

    async handle(directive: PowerControllerDirective): Promise<ResponseEvent<"Alexa.PowerController"> | ErrorResponse>  {
        this.logger.info(`Handling directive ${directive.directive.header.name}`);
        // Whether the directive is TurnOn or TurnOff, we send the same code
        return this.webIrClient.sendCodes([this.POWER_CODE])
            // If the response from WebIR is not an error, we respond with an Alexa response event. We don't actually care about the WebIR response payload
            .then(() => this.buildResponseEvent(directive))
            .catch(error => this.buildErrorResponse(directive, error));
    }

    private isTurnOn(directive: PowerControllerDirective): directive is TurnOn {
        return directive.directive.header.name === "TurnOn";
    }

    private buildResponseEvent(directive: PowerControllerDirective): ResponseEvent<"Alexa.PowerController"> {
        return {
            "event": {
                "header": {
                    "namespace": "Alexa",
                    "name": "Response",
                    "messageId": uuidv4(),
                    "correlationToken": directive.directive.header.correlationToken,
                    "payloadVersion": "3"
                },
                "endpoint": {
                    "endpointId": directive.directive.endpoint.endpointId
                },
                "payload": {}
            },
            "context": {
                "properties": [
                    {
                        "namespace": "Alexa.PowerController",
                        "name": "powerState",
                        "value": this.isTurnOn(directive) ? "ON" : "OFF",
                        "timeOfSample": new Date().toISOString(),
                        "uncertaintyInMilliseconds": 500
                    }
                ]
            }
        };
    }

    private buildErrorResponse(directive: PowerControllerDirective, error: AxiosError): ErrorResponse {
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
                    "message": error.message || "Probably a connection time out"
                }
            }
        };
    }

}