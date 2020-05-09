import { AlexaResponse, EndpointDirective } from "alexa-smarthome-ts"
import { SmartHomeDirective } from "../model/model";

export interface DirectiveHandler<D extends SmartHomeDirective, R extends AlexaResponse> {
    handle(directive: D): R
}

export interface EndpointDirectiveHandler<D extends EndpointDirective<any, any>, R extends AlexaResponse> extends DirectiveHandler<D, R> {
    canHandle(directive: D): boolean
}