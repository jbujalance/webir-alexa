import {DiscoveryDirective, EndpointDirective} from "alexa-smarthome-ts"

export type SmartHomeDirective = DiscoveryDirective | EndpointDirective<any, any>;