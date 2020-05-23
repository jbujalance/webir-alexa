import { EndpointDirectiveHandler } from "./directive-handler";
import { ChangeChannel } from "../directives/ChangeChannel";
import { ResponseEvent, ErrorResponse } from "alexa-smarthome-ts";
import { Logger, createLogger, format, transports } from "winston";
import { WebIrClient } from "../webir-client";
import { v4 as uuidv4 } from "uuid";
import { buildErrorResponse } from "./util";


export class ChangeChannelHandler implements EndpointDirectiveHandler<ChangeChannel, ResponseEvent<"Alexa.ChannelController">> {

    private readonly logger: Logger = createLogger({
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        transports: [new transports.Console()]
    });

    private webIrClient: WebIrClient;

    constructor(webIrClient: WebIrClient) {
        this.webIrClient = webIrClient;
    }

    canHandle(directive: ChangeChannel): boolean {
        return directive.directive.header.namespace === "Alexa.ChannelController"
            && directive.directive.header.name === "ChangeChannel";
    }

    async handle(directive: ChangeChannel): Promise<ResponseEvent<"Alexa.ChannelController"> | ErrorResponse> {
        this.logger.info(`Handling directive ${directive.directive.header.name}`);
        this.logger.info(`Directive payload: ${directive.directive.payload}`);
        return this.webIrClient.sendInteger(this.getChannelNumber(directive))
            .then(() => this.buildResponseEvent(directive))
            .catch(error => buildErrorResponse(directive, error));
    }

    private getChannelNumber(directive: ChangeChannel): number {
        const channelNumberStr: string | undefined = directive.directive.payload.channel.number;
        // TODO if the channel number is not provided, check the channel callsign and map it to the channel number
        return channelNumberStr ? parseInt(channelNumberStr, 10) : 0;
    }

    private buildResponseEvent(directive: ChangeChannel): ResponseEvent<"Alexa.ChannelController"> {
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
                        "namespace": "Alexa.ChannelController",
                        "name": "channel",
                        "value": {
                            "number": directive.directive.payload.channel.number,
                            "callSign": directive.directive.payload.channel.callSign,
                            "affiliateCallSign": directive.directive.payload.channel.affiliateCallSign
                        },
                        "timeOfSample": new Date().toISOString(),
                        "uncertaintyInMilliseconds": 500
                    },
                    {
                        // @ts-ignore
                        "namespace": "Alexa.PowerController",
                        // @ts-ignore
                        "name": "powerState",
                        // @ts-ignore
                        "value": "ON",
                        "timeOfSample": new Date().toISOString(),
                        "uncertaintyInMilliseconds": 500
                    }
                ]
            }
        };
    }

}