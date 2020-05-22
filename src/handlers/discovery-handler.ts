import { DiscoveryDirective, DiscoverEvent } from "alexa-smarthome-ts";
import { DirectiveHandler } from "./directive-handler";
import { v4 as uuidv4 } from "uuid";
import { createLogger, Logger, transports, format } from "winston";

export class DiscoveryHandler implements DirectiveHandler<DiscoveryDirective, DiscoverEvent<any>> {

    private logger: Logger = createLogger({
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        transports: [new transports.Console()]
    });

    handle(directive: DiscoveryDirective): DiscoverEvent<any> {
        const event: DiscoverEvent<any> = this.getDiscoverEvent(directive);
        this.logger.info(`Send discover event with message id ${event.event.header.messageId}`);
        return event;
    }

    private getDiscoverEvent(directive: DiscoveryDirective): DiscoverEvent<any> {
        return {
            "event": {
                "header": {
                    "namespace": "Alexa.Discovery",
                    "name": "Discover.Response",
                    "payloadVersion": "3",
                    "messageId": uuidv4(),
                    "correlationToken": directive.directive.header.correlationToken
                },
                "payload": {
                    "endpoints": [
                        {
                            "endpointId": "webir_kitchen",
                            "manufacturerName": "Jose Bujalance",
                            "friendlyName": "La tele de la cocina",
                            "description": "Tele de la cocina controlada por Raspberry Pi y WebIR",
                            "displayCategories": ["TV"],
                            "capabilities": [
                                {
                                    "type": "AlexaInterface",
                                    "interface": "Alexa",
                                    "version": "3"
                                },
                                {
                                    "type": "AlexaInterface",
                                    "interface": "Alexa.PowerController",
                                    "version": "3",
                                    "properties": {
                                        "supported": [
                                            {
                                                "name": "powerState"
                                            }
                                        ],
                                        "proactivelyReported": false,
                                        "retrievable": false
                                    }
                                },
                                {
                                    "type": "AlexaInterface",
                                    "interface": "Alexa.StepSpeaker",
                                    "version": "3"
                                },
                                {
                                    "type": "AlexaInterface",
                                    "interface": "Alexa.ChannelController",
                                    "version": "3",
                                    "properties": {
                                        "supported": [
                                            {
                                                "name": "channel"
                                            }
                                        ],
                                        "proactivelyReported": false,
                                        "retrievable": false
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        };
    }

}