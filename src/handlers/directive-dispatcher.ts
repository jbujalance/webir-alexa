import { AlexaResponse, DiscoveryDirective } from "alexa-smarthome-ts";
import { SmartHomeDirective } from "../model/model"
import { DiscoveryHandler } from "./discovery-handler";
import { EndpointDirectiveHandler } from "./directive-handler";

/**
 * Lambda handler.
 */
export class DirectiveHandlerDispatcher {

    private discoveryHandler: DiscoveryHandler;
    private endpointDirectiveHandlers: EndpointDirectiveHandler<any, any>[];

    constructor(discoveryHandler: DiscoveryHandler, endpointDirectiveHandlers: EndpointDirectiveHandler<any, any>[]) {
        this.discoveryHandler = discoveryHandler;
        this.endpointDirectiveHandlers = endpointDirectiveHandlers;
    }

    public async handle(directive: SmartHomeDirective, context: any): Promise<AlexaResponse | null> {
        if (this.isDiscoveryDirective(directive)) {
            return this.discoveryHandler.handle(directive);
        }
        return null;
    }

    private isDiscoveryDirective(directive: SmartHomeDirective): directive is DiscoveryDirective {
        return directive.directive.header.namespace === 'Alexa.Discovery';
    }
}
