import { EndpointDirectiveHandler } from "./directive-handler";
import { SkipChannels } from "../directives/SkipChannels";
import { ResponseEvent, ErrorResponse } from "alexa-smarthome-ts";
import { Logger, createLogger, format, transports } from "winston";
import { WebIrClient } from "../webir-client";
import { v4 as uuidv4 } from "uuid";
import { buildErrorResponse } from "./util";


export class SkipChannelsHandler implements EndpointDirectiveHandler<SkipChannels, ResponseEvent<"Alexa.ChannelController">> {

    private readonly logger: Logger = createLogger({
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        transports: [new transports.Console()]
    });

    private readonly CHANNEL_UP_CODE = "KEY_CHANNELUP";
    private readonly CHANNEL_DOWN_CODE = "KEY_CHANNELDOWN";
    private webIrClient: WebIrClient;

    constructor(webIrClient: WebIrClient) {
        this.webIrClient = webIrClient;
    }

    canHandle(directive: SkipChannels): boolean {
        return directive.directive.header.namespace === "Alexa.ChannelController"
            && directive.directive.header.name === "SkipChannels";
    }

    async handle(directive: SkipChannels): Promise<ResponseEvent<"Alexa.ChannelController"> | ErrorResponse> {
        this.logger.info(`Handling directive ${directive.directive.header.name}`);
        const codes: string[] = [this.getWebIrCode(directive)];
        const count: number = this.getWebIrCodeCount(directive);
        return this.webIrClient.sendCodes(codes, count)
            .then(() => this.buildResponseEvent(directive))
            .catch(error => buildErrorResponse(directive, error));
    }

    private getWebIrCode(directive: SkipChannels): string {
        const count: number = directive.directive.payload.channelCount
        return count > 0 ? this.CHANNEL_UP_CODE : this.CHANNEL_DOWN_CODE;
    }

    private getWebIrCodeCount(directive: SkipChannels): number {
        return Math.abs(directive.directive.payload.channelCount);
    }

    private buildResponseEvent(directive: SkipChannels): ResponseEvent<"Alexa.ChannelController"> {
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