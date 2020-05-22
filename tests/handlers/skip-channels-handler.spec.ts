import { SkipChannelsHandler } from "../../src/handlers/skip-channels-handler";
import { WebIrClient } from "../../src/webir-client";
import { SkipChannels } from "../../src/directives/SkipChannels";
import { mocked } from "ts-jest/utils";
import { ErrorResponse } from "alexa-smarthome-ts";

jest.mock("../../src/webir-client");
const MockWebIrClient = WebIrClient as jest.Mock<WebIrClient>;

describe("SkipChannelsHandler", () => {

    let skipChannelsHander: SkipChannelsHandler;
    let mockWebIrClient: WebIrClient;

    beforeEach(() => {
        mockWebIrClient = new MockWebIrClient();
        skipChannelsHander = new SkipChannelsHandler(mockWebIrClient);
    });

    it("should be able to handle a SkipChannels directive", () => {
        // GIVEN a SkipChannels directive
        const directive: SkipChannels = {
            "directive": {
                "header": {
                    "namespace": "Alexa.ChannelController",
                    "name": "SkipChannels",
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
                    "channelCount": 1
                }
            }
        };

        // WHEN cheking if this directive can be handled
        const canHandle: boolean = skipChannelsHander.canHandle(directive);

        // THEN the directive can be handled
        expect(canHandle).toBeTruthy();
    });

    it("should send to WebIR the expected codes when handling a SkipChannels direrctive skipping channels up", () => {
        // GIVEN a SkipChannels directive skipping channels up
        const directive: SkipChannels = {
            "directive": {
                "header": {
                    "namespace": "Alexa.ChannelController",
                    "name": "SkipChannels",
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
                    "channelCount": 3
                }
            }
        };

        // WHEN handling this directive
        skipChannelsHander.handle(directive);

        // THEN the WebIR client is called with the expected parameters
        expect(mockWebIrClient.sendCodes).toHaveBeenLastCalledWith(["KEY_CHANNELUP"], 3);
    });

    it("should send to WebIR the expected codes when handling a SkipChannels direrctive skipping channels down", () => {
        // GIVEN a SkipChannels directive skipping channels down
        const directive: SkipChannels = {
            "directive": {
                "header": {
                    "namespace": "Alexa.ChannelController",
                    "name": "SkipChannels",
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
                    "channelCount": -5
                }
            }
        };

        // WHEN handling this directive
        skipChannelsHander.handle(directive);

        // THEN the WebIR client is called with the expected parameters
        expect(mockWebIrClient.sendCodes).toHaveBeenLastCalledWith(["KEY_CHANNELDOWN"], 5);
    });

    it("should respond with an Alexa response when the call to the WebIR client is successful after a SkipChannels directive", async () => {
        // GIVEN a mocked webIR client that returns a successful response
        mocked(mockWebIrClient).sendCodes.mockImplementationOnce((codes: string[], count?: number) => {
            return Promise.resolve({
                data: {
                    status: "status",
                    payload: "payload"
                },
                status: 200,
                statusText: "OK",
                headers: {},
                config: {},
              });
        });

        // AND a SkipChannels directive
        const directive: SkipChannels = {
            "directive": {
                "header": {
                    "namespace": "Alexa.ChannelController",
                    "name": "SkipChannels",
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
                    "channelCount": 4
                }
            }
        };

        // WHEN handling this directive
        const response = await skipChannelsHander.handle(directive);

        // THEN the response should be an Alexa response
        expect(response.event.header.namespace).toEqual("Alexa");
        expect(response.event.header.name).toEqual("Response");
        expect(response.event.payload).toEqual({});
    });

    it("should respond with an Alexa error when the call to the WebIR client fails when handling a SkipChannels directive", async () => {
        // GIVEN a mocked webIR client that returns a failed response
        mocked(mockWebIrClient).sendCodes.mockImplementationOnce((codes: string[]) => {
            return Promise.reject({
                data: {
                    status: "status",
                    payload: "payload"
                },
                status: 500,
                statusText: "Internal error",
                headers: {},
                config: {},
              });
        });

        // AND SkipChannels directive
        const directive: SkipChannels = {
            "directive": {
                "header": {
                    "namespace": "Alexa.ChannelController",
                    "name": "SkipChannels",
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
                    "channelCount": 4
                }
            }
        };

        // WHEN handling this directive
        let response = await skipChannelsHander.handle(directive);

        // THEN the response should be an Alexa error
        expect(response.event.header.namespace).toEqual("Alexa");
        expect(response.event.header.name).toEqual("ErrorResponse");

        response = response as ErrorResponse;
        // AND the expected error type is set on the error payload
        expect(response.event.payload.type).toEqual("ENDPOINT_UNREACHABLE");
    });
});