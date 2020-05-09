import { DirectiveHandlerDispatcher } from "./handlers/directive-dispatcher";
import { DiscoveryHandler } from "./handlers/discovery-handler";

const dispatcher = new DirectiveHandlerDispatcher(new DiscoveryHandler(), []);

// Entry point to the AWS Lambda
export const handler = dispatcher.handle.bind(dispatcher);