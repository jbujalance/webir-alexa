import { DirectiveHandlerDispatcher } from "./handlers/directive-dispatcher";
import { PowerControllerHandler } from "./handlers/power-controller-handler";
import { StepSpeakerHandler } from "./handlers/step-speaker-handler";
import { WebIrClient } from "./webir-client";
import { DiscoveryHandler } from "./handlers/discovery-handler";
import { SkipChannelsHandler } from "./handlers/skip-channels-handler";
import { ChangeChannelHandler } from "./handlers/change-channel-handler";

const webIrClient = new WebIrClient();
const handlers = [
    new PowerControllerHandler(webIrClient),
    new StepSpeakerHandler(webIrClient),
    new SkipChannelsHandler(webIrClient),
    new ChangeChannelHandler(webIrClient)
];
const dispatcher = new DirectiveHandlerDispatcher(new DiscoveryHandler(), handlers);

// Entry point to the AWS Lambda
export const handler = dispatcher.handle.bind(dispatcher);
