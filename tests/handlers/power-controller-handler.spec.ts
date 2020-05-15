import { PowerControllerHandler } from "../../src/handlers/power-controller-handler";
import { WebIrClient } from "../../src/webir-client";
import { TurnOn, TurnOff, ResponseEvent, ErrorResponse } from "alexa-smarthome-ts";
import { mocked } from 'ts-jest/utils';

jest.mock("../../src/webir-client");
const MockWebIrClient = WebIrClient as jest.Mock<WebIrClient>;

describe("PowerControllerHandler", () => {
    const mockWebIrClient = new MockWebIrClient();
    const powerControllerHandler: PowerControllerHandler = new PowerControllerHandler(mockWebIrClient);

    it("should be able to handle a TurnOn directive", () => {
        // GIVEN a TurnOn directive
        const directive: TurnOn = {
            "directive": {
                "header": {
                    "namespace": "Alexa.PowerController",
                    "name": "TurnOn",
                    "messageId": "message_id",
                    "correlationToken": "token",
                    "payloadVersion": "3"
                },
                "endpoint": {
                    "scope": {
                        "type": "BearerToken",
                        "token": "bearer"
                    },
                    "endpointId": "endpoint_id",
                    "cookie": {}
                },
                "payload": {}
            }
        };

        // WHEN checking if the powerController handler can handle this directive
        const canHandle = powerControllerHandler.canHandle(directive);

        // THEN the handler can handle this directive
        expect(canHandle).toBeTruthy();
    });

    it("should be able to handle a TurnOff directive", () => {
        // GIVEN a TurnOff directive
        const directive: TurnOff = {
            "directive": {
                "header": {
                    "namespace": "Alexa.PowerController",
                    "name": "TurnOff",
                    "messageId": "message_id",
                    "correlationToken": "token",
                    "payloadVersion": "3"
                },
                "endpoint": {
                    "scope": {
                        "type": "BearerToken",
                        "token": "bearer"
                    },
                    "endpointId": "endpoint_id",
                    "cookie": {}
                },
                "payload": {}
            }
        };

        // WHEN checking if the powerController handler can handle this directive
        const canHandle = powerControllerHandler.canHandle(directive);

        // THEN the handler can handle this directive
        expect(canHandle).toBeTruthy();
    });

    it("should send the expected code to the WebIR client when handling a TurnOn directive", () => {
        // GIVEN a TurnOn directive
        const directive: TurnOn = {
            "directive": {
                "header": {
                    "namespace": "Alexa.PowerController",
                    "name": "TurnOn",
                    "messageId": "message_id",
                    "correlationToken": "token",
                    "payloadVersion": "3"
                },
                "endpoint": {
                    "scope": {
                        "type": "BearerToken",
                        "token": "bearer"
                    },
                    "endpointId": "endpoint_id",
                    "cookie": {}
                },
                "payload": {}
            }
        };

        // WHEN handling this directive
        powerControllerHandler.handle(directive);

        // THEN the WebIR client has been called with the expected code
        expect(mockWebIrClient.sendCodes).toHaveBeenCalledWith(["KEY_POWER"]);
    });

    it("should send the expected code to the WebIR client when handling a TurnOff directive", () => {
        // GIVEN a TurnOff directive
        const directive: TurnOff = {
            "directive": {
                "header": {
                    "namespace": "Alexa.PowerController",
                    "name": "TurnOff",
                    "messageId": "message_id",
                    "correlationToken": "token",
                    "payloadVersion": "3"
                },
                "endpoint": {
                    "scope": {
                        "type": "BearerToken",
                        "token": "bearer"
                    },
                    "endpointId": "endpoint_id",
                    "cookie": {}
                },
                "payload": {}
            }
        };

        // WHEN handling this directive
        powerControllerHandler.handle(directive);

        // THEN the WebIR client has been called with the expected code
        expect(mockWebIrClient.sendCodes).toHaveBeenCalledWith(["KEY_POWER"]);
    });

    it("should respond with an Alexa response when the call to the WebIR client is successful after a TurnOff directive", async () => {
        // GIVEN a mocked webIR client that returns a successful response
        mocked(mockWebIrClient).sendCodes.mockImplementationOnce((codes: string[]) => {
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

        // AND a directive to turn off the TV
        const directive: TurnOff = {
            "directive": {
                "header": {
                    "namespace": "Alexa.PowerController",
                    "name": "TurnOff",
                    "messageId": "message_id",
                    "correlationToken": "token",
                    "payloadVersion": "3"
                },
                "endpoint": {
                    "scope": {
                        "type": "BearerToken",
                        "token": "bearer"
                    },
                    "endpointId": "endpoint_id",
                    "cookie": {}
                },
                "payload": {}
            }
        };

        // WHEN handling the directive with the power controller handler
        let response = await powerControllerHandler.handle(directive);

        // THEN the response should be an Alexa response
        expect(response.event.header.namespace).toEqual("Alexa");
        expect(response.event.header.name).toEqual("Response");

        response = response as ResponseEvent<"Alexa.PowerController">
        // AND the context specifies that the TV has been turned off
        expect(response.context.properties[0].value).toEqual("OFF");
    });

    it("should respond with an Alexa response when the call to the WebIR client is successful after a TurnOn directive", async () => {
        // GIVEN a mocked webIR client that returns a successful response
        mocked(mockWebIrClient).sendCodes.mockImplementationOnce((codes: string[]) => {
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

        // AND a directive to turn on the TV
        const directive: TurnOn = {
            "directive": {
                "header": {
                    "namespace": "Alexa.PowerController",
                    "name": "TurnOn",
                    "messageId": "message_id",
                    "correlationToken": "token",
                    "payloadVersion": "3"
                },
                "endpoint": {
                    "scope": {
                        "type": "BearerToken",
                        "token": "bearer"
                    },
                    "endpointId": "endpoint_id",
                    "cookie": {}
                },
                "payload": {}
            }
        };

        // WHEN handling the directive with the power controller handler
        let response = await powerControllerHandler.handle(directive);

        // THEN the response should be an Alexa response
        expect(response.event.header.namespace).toEqual("Alexa");
        expect(response.event.header.name).toEqual("Response");

        response = response as ResponseEvent<"Alexa.PowerController">
        // AND the context specifies that the TV has been turned on
        expect(response.context.properties[0].value).toEqual("ON");
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

        // AND a directive to turn on the TV
        const directive: TurnOn = {
            "directive": {
                "header": {
                    "namespace": "Alexa.PowerController",
                    "name": "TurnOn",
                    "messageId": "message_id",
                    "correlationToken": "token",
                    "payloadVersion": "3"
                },
                "endpoint": {
                    "scope": {
                        "type": "BearerToken",
                        "token": "bearer"
                    },
                    "endpointId": "endpoint_id",
                    "cookie": {}
                },
                "payload": {}
            }
        };

        // WHEN handling the directive with the power controller handler
        let response = await powerControllerHandler.handle(directive);

        // THEN the response should be an Alexa error
        expect(response.event.header.namespace).toEqual("Alexa");
        expect(response.event.header.name).toEqual("ErrorResponse");

        response = response as ErrorResponse
        // AND the expected error type is set on the error payload
        expect(response.event.payload.type).toEqual("ENDPOINT_UNREACHABLE");
    });
});