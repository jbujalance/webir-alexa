import { ChangeChannelHandler } from "../../src/handlers/change-channel-handler";
import { WebIrClient } from "../../src/webir-client";
import { ChangeChannel } from "../../src/directives/ChangeChannel";
import { ErrorResponse } from "alexa-smarthome-ts";

jest.mock("../../src/webir-client");
const MockWebIrClient = WebIrClient as jest.Mock<WebIrClient>;

describe("ChangeChannelHandler", () => {

    let changeChannelHander: ChangeChannelHandler;
    let mockWebIrClient: WebIrClient;

    beforeEach(() => {
        mockWebIrClient = new MockWebIrClient();
        changeChannelHander = new ChangeChannelHandler(mockWebIrClient);
    });

    it("should handle a change channel directive", () => {
        // GIVEN a change channel directive
        const directive: ChangeChannel = {
            "directive": {
                "header": {
                    "namespace": "Alexa.ChannelController",
                    "name": "ChangeChannel",
                    "messageId": "<message id>",
                    "correlationToken": "<an opaque correlation token>",
                    "payloadVersion": "3"
                },
                "endpoint": {
                    "scope": {
                        "type": "BearerToken",
                        "token": "<an OAuth2 bearer token>"
                    },
                    "endpointId": "<endpoint id>",
                    "cookie": {}
                },
                "payload": {
                    "channel": {
                        "number": "9",
                        "callSign": "PBS",
                        "affiliateCallSign": "KCTS",
                        "uri": "<channel uri>"
                    },
                    "channelMetadata": {
                        "name": "Alternate channel name",
                        "image": "<url for image>"
                    }
                }
            }
        };

        // WHEN checking if the handler can handle this directive
        const canHandle = changeChannelHander.canHandle(directive);

        // THEN the directive can be handled
        expect(canHandle).toBeTruthy();
    });

    it("should send the channel number to WebIR when the directive carries a channel number", () => {
        // GIVEN a change channel directive containing a channel number
        const directive: ChangeChannel = {
            "directive": {
                "header": {
                    "namespace": "Alexa.ChannelController",
                    "name": "ChangeChannel",
                    "messageId": "<message id>",
                    "correlationToken": "<an opaque correlation token>",
                    "payloadVersion": "3"
                },
                "endpoint": {
                    "scope": {
                        "type": "BearerToken",
                        "token": "<an OAuth2 bearer token>"
                    },
                    "endpointId": "<endpoint id>",
                    "cookie": {}
                },
                "payload": {
                    "channel": {
                        "number": "9"
                    },
                    "channelMetadata": {}
                }
            }
        };

        // WHEN handling this directive
        changeChannelHander.handle(directive);

        // THEN the webIr client is called with the expected arguments
        expect(mockWebIrClient.sendInteger).toHaveBeenLastCalledWith(9);
    });

    it("should send the channel name to WebIR when the directive carries a channel name and not a channel number", () => {
        // GIVEN a change channel directive containing a channel name
        const directive: ChangeChannel = {
            "directive": {
                "header": {
                    "namespace": "Alexa.ChannelController",
                    "name": "ChangeChannel",
                    "messageId": "<message id>",
                    "correlationToken": "<an opaque correlation token>",
                    "payloadVersion": "3"
                },
                "endpoint": {
                    "scope": {
                        "type": "BearerToken",
                        "token": "<an OAuth2 bearer token>"
                    },
                    "endpointId": "<endpoint id>",
                    "cookie": {}
                },
                "payload": {
                    "channel": {},
                    "channelMetadata": {
                        "name": "Telemadrid",
                    }
                }
            }
        };

        // WHEN handling this directive
        changeChannelHander.handle(directive);

        // THEN the webIr client is called with the expected arguments
        expect(mockWebIrClient.sendChannel).toHaveBeenLastCalledWith("Telemadrid");
    });

    it("should respond with an error if neither the channel number nor the name are present in the directive", async () => {
        // GIVEN a change channel directive with no channel number and no channel name
        const directive: ChangeChannel = {
            "directive": {
                "header": {
                    "namespace": "Alexa.ChannelController",
                    "name": "ChangeChannel",
                    "messageId": "<message id>",
                    "correlationToken": "<an opaque correlation token>",
                    "payloadVersion": "3"
                },
                "endpoint": {
                    "scope": {
                        "type": "BearerToken",
                        "token": "<an OAuth2 bearer token>"
                    },
                    "endpointId": "<endpoint id>",
                    "cookie": {}
                },
                "payload": {
                    "channel": {},
                    "channelMetadata": {}
                }
            }
        };

        // WHEN handling this directive
        expect.assertions(3);
        try {
            await changeChannelHander.handle(directive);
        } catch (error) {
            // THEN the response should be an Alexa error
            error = error as ErrorResponse;
            expect(error.event.header.namespace).toEqual("Alexa");
            expect(error.event.header.name).toEqual("ErrorResponse");
            // AND the expected error type is set on the error payload
            expect(error.event.payload.type).toEqual("INVALID_DIRECTIVE");
        }
    });
});