import { DirectiveHandlerDispatcher } from "../../src/handlers/directive-dispatcher";
import { PowerControllerHandler } from "../../src/handlers/power-controller-handler";
import { DiscoveryHandler } from "../../src/handlers/discovery-handler";
import { DiscoveryDirective, DiscoverEvent, TurnOff, ResponseEvent, SetTargetTemperature, ErrorResponse } from "alexa-smarthome-ts"
import { mocked } from "ts-jest/utils";

jest.mock("../../src/handlers/power-controller-handler");
jest.mock("../../src/handlers/discovery-handler");

const MockPowerControllerHandler = PowerControllerHandler as jest.Mock<PowerControllerHandler>;
const MockDiscoveryHandler = DiscoveryHandler as jest.Mock<DiscoveryHandler>;

describe("DirectiveHandlerDispatcher", () => {

    let discoveryHandler: DiscoveryHandler;
    let powerController: PowerControllerHandler;
    let directiveDispatcher: DirectiveHandlerDispatcher;

    beforeEach(() => {
        discoveryHandler = new MockDiscoveryHandler();
        powerController = new MockPowerControllerHandler();
        directiveDispatcher = new DirectiveHandlerDispatcher(discoveryHandler, [powerController]);
    });


    it("should handle a discovery directive with the discovery handler", async () => {
        // GIVEN a fake discovery event
        const discoveryEvent: DiscoverEvent<any> = {
            "event": {
                "header": {
                    "namespace": "Alexa.Discovery",
                    "name": "Discover.Response",
                    "payloadVersion": "3",
                    "messageId": "message_id",
                    "correlationToken": "token"
                },
                "payload": {
                    "endpoints": [
                        {
                            "endpointId": "webir_kitchen",
                            "manufacturerName": "Jose Bujalance",
                            "friendlyName": "Tele de la cocina",
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
                                }
                            ]
                        }
                    ]
                }
            }
        };

        // AND a mocked discovery handler returning this fake discover event
        mocked(discoveryHandler).handle.mockImplementationOnce((directive: DiscoveryDirective) => discoveryEvent);

        // AND a discovery directive to be dispatched
        // @ts-ignore
        const discoveryDirective: DiscoveryDirective = {
            "directive": {
                "header": {
                    "namespace": "Alexa.Discovery",
                    "name": "Discover",
                    "payloadVersion": "3",
                    "messageId": "1bd5d003-31b9-476f-ad03-71d471922820"
                },
                "payload": {
                    "scope": {
                        "type": "BearerToken",
                        "token": "access-token-from-skill"
                    }
                }
            }
        };

        // WHEN dispatching this directive with the directive dispatcher
        const response = await directiveDispatcher.handle(discoveryDirective, null);

        // THEN the power controller has not been asked to handle the directive
        expect(powerController.canHandle).not.toBeCalled();
        expect(powerController.handle).not.toBeCalled();

        // AND the returned response is the same discovery event returned by the discovery handler
        expect(response.event.header.messageId).toEqual(discoveryEvent.event.header.messageId);
    });

    it("should handle a power controller directive with the power controller handler", async () => {
        // GIVEN a fake TurnOff directive
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

        // AND a fake power controller response event
        const powerControllerResponse: ResponseEvent<"Alexa.PowerController"> = {
            "event": {
                "header": {
                    "namespace": "Alexa",
                    "name": "Response",
                    "messageId": "<message id>",
                    "correlationToken": "<an opaque correlation token>",
                    "payloadVersion": "3"
                },
                "endpoint": {
                    "endpointId": "<endpoint id>"
                },
                "payload": {}
            },
            "context": {
                "properties": [
                    {
                        "namespace": "Alexa.PowerController",
                        "name": "powerState",
                        "value": "OFF",
                        "timeOfSample": "2017-02-03T16:20:50.52Z",
                        "uncertaintyInMilliseconds": 500
                    }
                ]
            }
        };

        // AND a mocked power controller handler
        mocked(powerController).canHandle.mockImplementationOnce(() => true);
        mocked(powerController).handle.mockResolvedValueOnce(powerControllerResponse);

        // WHEN dispatching this directive
        const response = await directiveDispatcher.handle(directive, null);

        // THEN the discovery directive is not asked to handle the directive, as it is not a discovery directive
        expect(discoveryHandler.handle).not.toBeCalled();

        // AND the power controller is asked to handle the directive
        expect(powerController.canHandle).toBeCalledWith(directive);
        expect(powerController.handle).toBeCalledWith(directive);

        // AND the returned response is the same response returned by the power controller directive
        expect(response.event.header.messageId).toEqual(powerControllerResponse.event.header.messageId);
    });

    it("should return an error if there are not any handlers that can handle the directive", async () => {
        // GIVEN a directive that cannot be handled
        const directive: SetTargetTemperature = {
            "directive": {
                "header": {
                    "namespace": "Alexa.ThermostatController",
                    "name": "SetTargetTemperature",
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
                    "targetSetpoint": {
                        "value": 20.0,
                        "scale": "CELSIUS"
                    }
                }
            }
        };

        // WHEN this directive is dispatched
        let response = await directiveDispatcher.handle(directive, null);

        // THEN the discovery directive handler and the power controller handler are not asked to handle the directive
        expect(discoveryHandler.handle).not.toBeCalled();
        expect(powerController.canHandle).toBeCalledWith(directive);
        expect(powerController.handle).not.toBeCalled();

        // AND the response is an error containing the expected error type
        expect(response.event.header.namespace).toEqual("Alexa");
        expect(response.event.header.name).toEqual("ErrorResponse");
        response = response as ErrorResponse;
        expect(response.event.payload.type).toEqual("INVALID_DIRECTIVE");
    });
});