import { AlexaResponse, EndpointDirective, DiscoveryDirective } from "alexa-smarthome-ts"

export type SmartHomeDirective = DiscoveryDirective | EndpointDirective<any, any>;

export interface DirectiveHandler<D = SmartHomeDirective, R = AlexaResponse> {
    handle(directive: D): R
}

export interface EndpointDirectiveHandler<D extends EndpointDirective<any, any>, R extends AlexaResponse> extends DirectiveHandler<D, R> {
    canHandle(directive: D): boolean
}