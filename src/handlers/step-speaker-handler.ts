import { EndpointDirectiveHandler } from "./directive-handler";
import { AdjustVolume } from "../directives/AdjustVolume";
import { SetMute } from "../directives/SetMute";
import { ResponseEvent, ErrorResponse } from "alexa-smarthome-ts";
import { STEP_SPEAKER, ADJUST_VOLUME_DIRECTIVE } from "../capabilities/StepSpeaker";
import { Logger, createLogger, format, transports } from "winston";
import { WebIrClient } from "../webir-client";
import { v4 as uuidv4 } from "uuid";
import { buildErrorResponse } from "./util";

declare type StepSpeakerDirective = AdjustVolume | SetMute;

export class StepSpeakerHandler implements EndpointDirectiveHandler<StepSpeakerDirective, ResponseEvent<"Alexa.StepSpeaker">> {

    private readonly logger: Logger = createLogger({
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        transports: [new transports.Console()]
    });

    private readonly VOLUME_UP_CODE = "KEY_VOLUMEUP";
    private readonly VOLUME_DOWN_CODE = "KEY_VOLUMEDOWN";
    private readonly MUTE_CODE = "KEY_MUTE";
    private webIrClient: WebIrClient;

    constructor(webIrClient: WebIrClient) {
        this.webIrClient = webIrClient;
    }

    canHandle(directive: StepSpeakerDirective): boolean {
        return directive.directive.header.namespace === STEP_SPEAKER;
    }

    async handle(directive: StepSpeakerDirective): Promise<ResponseEvent<"Alexa.StepSpeaker"> | ErrorResponse> {
        this.logger.info(`Handling directive ${directive.directive.header.name}`);
        const codes = this.getWebIrCodes(directive);
        const count = this.getWebIrCodeCount(directive);
        return this.webIrClient.sendCodes(codes, count)
            .then(() => this.buildResponseEvent(directive))
            .catch(error => buildErrorResponse(directive, error));
    }

    private isAdjustVolume(directive: StepSpeakerDirective): directive is AdjustVolume {
        return directive.directive.header.name === ADJUST_VOLUME_DIRECTIVE;
    }

    private getWebIrCodes(directive: StepSpeakerDirective): string[] {
        if (this.isAdjustVolume(directive)) {
            return this.getAdjustVolumeWebIrCodes(directive);
        }
        // If the directive is a Setmute directive, we send the MUTE_CODE either the directive is to mute or unmute.
        return [this.MUTE_CODE];
    }

    private getAdjustVolumeWebIrCodes(directive: AdjustVolume): string[] {
        const steps: number = directive.directive.payload.volumeSteps;
        return steps > 0 ? [this.VOLUME_UP_CODE] : [this.VOLUME_DOWN_CODE];
    }

    private getWebIrCodeCount(directive: StepSpeakerDirective): number | undefined {
        if (this.isAdjustVolume(directive)) {
            const steps: number = directive.directive.payload.volumeSteps;
            return Math.abs(steps);
        }
    }

    private buildResponseEvent(directive: StepSpeakerDirective): ResponseEvent<"Alexa.StepSpeaker"> {
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