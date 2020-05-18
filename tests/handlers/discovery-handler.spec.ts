import { DiscoveryHandler } from "../../src/handlers/discovery-handler";
import { DiscoveryDirective } from "alexa-smarthome-ts";

describe("Discovery handler", () => {

    const discoveryHandler = new DiscoveryHandler();

    it("should respond to a discovery directive without correlation token", () => {
        // GIVEN a discovery directive without correlation token
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

        // WHEN handling the discovery directive
        const discoveryEvent = discoveryHandler.handle(discoveryDirective);

        // THEN the discovery event is not linked to any correlation token
        expect(discoveryEvent.event.header.correlationToken).toBeUndefined();
    });

    it("should respond to a discovery directive with correlation token", () => {
        // GIVEN a discovery directive with correlation token
        // @ts-ignore
        const discoveryDirective: DiscoveryDirective = {
            "directive": {
              "header": {
                "namespace": "Alexa.Discovery",
                "name": "Discover",
                "payloadVersion": "3",
                "messageId": "1bd5d003-31b9-476f-ad03-71d471922820",
                "correlationToken": "some_correlation_token"
              },
              "payload": {
                "scope": {
                  "type": "BearerToken",
                  "token": "access-token-from-skill"
                }
              }
            }
          };

        // WHEN handling the discovery directive
        const discoveryEvent = discoveryHandler.handle(discoveryDirective);

        // THEN the discovery event is linked to the same correlation token from the directive
        expect(discoveryEvent.event.header.correlationToken).toEqual(discoveryDirective.directive.header.correlationToken);
    });
});