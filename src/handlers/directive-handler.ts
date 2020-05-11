import { AlexaResponse, EndpointDirective, DiscoveryDirective, ErrorResponse } from "alexa-smarthome-ts"

export type SmartHomeDirective = DiscoveryDirective | EndpointDirective<any, any>;

export interface DirectiveHandler<D = SmartHomeDirective, R = AlexaResponse> {
    handle(directive: D): R | Promise<R | ErrorResponse>
}

export interface EndpointDirectiveHandler<D extends EndpointDirective<any, any>, R extends AlexaResponse> extends DirectiveHandler<D, R> {
    canHandle(directive: D): boolean
}