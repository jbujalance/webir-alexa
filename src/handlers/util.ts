import { EndpointDirective, ErrorResponse } from "alexa-smarthome-ts";
import { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";

export function buildErrorResponse(directive: EndpointDirective<any, any>, error: AxiosError): ErrorResponse {
    return {
        "event": {
            "header": {
                "namespace": "Alexa",
                "name": "ErrorResponse",
                "messageId": uuidv4(),
                "payloadVersion": "3"
            },
            // @ts-ignore
            "endpoint": {
                "endpointId": directive.directive.endpoint.endpointId
            },
            "payload": {
                "type": "ENDPOINT_UNREACHABLE",
                "message": error.message || "Probably a connection time out"
            }
        }
    };
}