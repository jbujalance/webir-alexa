import { DiscoveryDirective, DiscoverEvent } from "alexa-smarthome-ts";
import { DirectiveHandler } from "./directive-handler";

export class DiscoveryHandler implements DirectiveHandler<DiscoveryDirective, DiscoverEvent<any>> {

    handle(directive: DiscoveryDirective): DiscoverEvent<any> {
        return {
            "event": {
              "header": {
                "correlationToken": "12345692749237492",
                "messageId": "1bd5d003-31b9-476f-ad03-71d471922820",
                "name": "Discover.Response",
                "namespace": "Alexa.Discovery",
                "payloadVersion": "3"
              },
              "payload": {
                "endpoints": [
                  {
                    "endpointId": "demo_id",
                    "manufacturerName": "Smart Device Company",
                    "friendlyName": "Bedroom Outlet",
                    "description": "Smart Device Switch",
                    "displayCategories": ["SWITCH"],
                    "cookie": {
                      "key1": "arbitrary key/value pairs for skill to reference this endpoint.",
                      "key2": "There can be multiple entries",
                      "key3": "but they should only be used for reference purposes.",
                      "key4": "This is not a suitable place to maintain current endpoint state."
                    },
                    "capabilities": [
                      {
                        "type": "AlexaInterface",
                        "interface": "Alexa",
                        "version": "3"
                      },
                      {
                        "interface": "Alexa.PowerController",
                        "version": "3",
                        "type": "AlexaInterface",
                        "properties": {
                          "supported": [
                            {
                              "name": "powerState"
                            }
                          ],
                          "retrievable": true
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