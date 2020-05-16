import { handler } from "../src/app";
import { TurnOn, ErrorResponse, AlexaResponse } from "alexa-smarthome-ts";

jest.setTimeout(15000);

describe("The application", () => {

    it("should respond with an error when the connection to the WebIR instance times out", async () => {
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

        // WHEN passing it to the main handler
        let response: AlexaResponse | ErrorResponse = await handler(directive, null);

        // THEN the response is an error
        expect(response.event.header.namespace).toEqual("Alexa");
        expect(response.event.header.name).toEqual("ErrorResponse");
        response = response as ErrorResponse;
        expect(response.event.payload.type).toEqual("ENDPOINT_UNREACHABLE");
    });
});