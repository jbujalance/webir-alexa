import { TurnOn, TurnOff, ResponseEvent, POWER_CONTROLLER } from "alexa-smarthome-ts";
import { EndpointDirectiveHandler } from "./directive-handler";

declare type PowerControllerDirective = TurnOn | TurnOff;

export class PowerControllerHandler implements EndpointDirectiveHandler<PowerControllerDirective, ResponseEvent<"Alexa.PowerController">> {

    canHandle(directive: PowerControllerDirective): boolean {
        return directive.directive.header.namespace === POWER_CONTROLLER;
    }

    handle(directive: PowerControllerDirective): ResponseEvent<"Alexa.PowerController"> {
        throw new Error("Method not implemented.");
    }

}