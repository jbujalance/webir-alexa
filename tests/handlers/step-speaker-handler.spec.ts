import { WebIrClient } from "../../src/webir-client";
import { StepSpeakerHandler } from "../../src/handlers/step-speaker-handler";
import { AdjustVolume } from "../../src/directives/AdjustVolume";
import { SetMute } from "../../src/directives/SetMute";
import { mocked } from "ts-jest/utils";
import { ErrorResponse } from "alexa-smarthome-ts";

jest.mock("../../src/webir-client");
const MockWebIrClient = WebIrClient as jest.Mock<WebIrClient>;

describe("StepSpeakerHandler", () => {
    let mockWebIrClient: WebIrClient;
    let stepSpeakerHandler: StepSpeakerHandler;

    beforeEach(() => {
        mockWebIrClient = new MockWebIrClient();
        stepSpeakerHandler = new StepSpeakerHandler(mockWebIrClient);
    });

    it("should be able to handle an AdjustVolume directive", () => {
        // GIVEN an AdjustVolume directive
        const directive: AdjustVolume = {
            "directive": {
                "header": {
                    "namespace": "Alexa.StepSpeaker",
                    "name": "AdjustVolume",
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
                    "volumeSteps": 20
                }
            }
        };

        // WHEN checking if the step speaker handler can handle this directive
        const canHandle = stepSpeakerHandler.canHandle(directive);

        // THEN the step speaker handler can handle this directive
        expect(canHandle).toBeTruthy();
    });

    it("should be able to handle a SetMute directive", () => {
        // GIVEN a SetMute directive
        const directive: SetMute = {
            "directive": {
                "header": {
                    "namespace": "Alexa.StepSpeaker",
                    "name": "SetMute",
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
                    "mute": true
                }
            }
        };

        // WHEN checking if the step speaker handler can handle this directive
        const canHandle = stepSpeakerHandler.canHandle(directive);

        // THEN the step speaker handler can handle this directive
        expect(canHandle).toBeTruthy();
    });

    it("should send the expected code to WebIr when handling a SetMute directive", () => {
        // GIVEN a SetMute directive
        const directive: SetMute = {
            "directive": {
                "header": {
                    "namespace": "Alexa.StepSpeaker",
                    "name": "SetMute",
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
                    "mute": true
                }
            }
        };

        // WHEN handling this directive
        stepSpeakerHandler.handle(directive);

        // THEN the WebIr client has been called with the expected parameters
        expect(mockWebIrClient.sendCodes).toHaveBeenCalledWith(["KEY_MUTE"], undefined);
    });

    it("should send the expected code to WebIr when handling an AdjustVolume directive turning the volume up", () => {
        // GIVEN an AdjustVolume directive
        const directive: AdjustVolume = {
            "directive": {
                "header": {
                    "namespace": "Alexa.StepSpeaker",
                    "name": "AdjustVolume",
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
                    "volumeSteps": 20
                }
            }
        };

        // WHEN handling this directive
        stepSpeakerHandler.handle(directive);

        // THEN the WebIr client is called with the expected arguments
        expect(mockWebIrClient.sendCodes).toHaveBeenLastCalledWith(["KEY_VOLUMEUP"], 20);
    });

    it("should send the expected code to WebIr when handling an AdjustVolume directive turning the volume down", () => {
        // GIVEN an AdjustVolume directive
        const directive: AdjustVolume = {
            "directive": {
                "header": {
                    "namespace": "Alexa.StepSpeaker",
                    "name": "AdjustVolume",
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
                    "volumeSteps": -15
                }
            }
        };

        // WHEN handling this directive
        stepSpeakerHandler.handle(directive);

        // THEN the WebIr client is called with the expected arguments
        expect(mockWebIrClient.sendCodes).toHaveBeenLastCalledWith(["KEY_VOLUMEDOWN"], 15);
    });

    it("should respond with an Alexa response when the call to the WebIR client is successful after a SetMute directive", async () => {
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

        // AND a SetMute directive
        const directive: SetMute = {
            "directive": {
                "header": {
                    "namespace": "Alexa.StepSpeaker",
                    "name": "SetMute",
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
                    "mute": true
                }
            }
        };

        // WHEN handling this directive
        const response = await stepSpeakerHandler.handle(directive);

        // THEN the response should be an Alexa response
        expect(response.event.header.namespace).toEqual("Alexa");
        expect(response.event.header.name).toEqual("Response");
        expect(response.event.payload).toEqual({});
    });

    it("should respond with an Alexa error when the call to the WebIR client fails", async () => {
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

        // AND an AdjustVolume directive
        const directive: AdjustVolume = {
            "directive": {
                "header": {
                    "namespace": "Alexa.StepSpeaker",
                    "name": "AdjustVolume",
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
                    "volumeSteps": -15
                }
            }
        };

        // WHEN handling this directive
        let response = await stepSpeakerHandler.handle(directive);

        // THEN the response should be an Alexa error
        expect(response.event.header.namespace).toEqual("Alexa");
        expect(response.event.header.name).toEqual("ErrorResponse");

        response = response as ErrorResponse;
        // AND the expected error type is set on the error payload
        expect(response.event.payload.type).toEqual("ENDPOINT_UNREACHABLE");
    });
});