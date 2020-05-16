import { DirectiveHandlerDispatcher } from "./handlers/directive-dispatcher";
import { PowerControllerHandler } from "./handlers/power-controller-handler";
import { WebIrClient } from "./webir-client";
import { DiscoveryHandler } from "./handlers/discovery-handler";

const webIrClient = new WebIrClient();
const dispatcher = new DirectiveHandlerDispatcher(new DiscoveryHandler(), [new PowerControllerHandler(webIrClient)]);

// Entry point to the AWS Lambda
export const handler = dispatcher.handle.bind(dispatcher);
