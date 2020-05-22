export declare const CHANNEL_CONTROLLER = "Alexa.ChannelController";
export declare const CHANGE_CHANNEL_DIRECTIVE = "ChangeChannel";
export declare const SKIP_CHANNELS_DIRECTIVE = "SkipChannels";
export declare type Channel = {
    number?: string,
    callSign?: string,
    affiliateCallSign?: string,
    uri?: string
};
export declare type ChannelMetadata = {
    name?: string,
    image?: string
};

declare module '../../node_modules/alexa-smarthome-ts/lib/base/Capabilities' {
    interface Capabilities {
        [CHANNEL_CONTROLLER]: true;
    }
}

declare module '../../node_modules/alexa-smarthome-ts/lib/base/Properties' {
    interface Properties {
        [CHANNEL_CONTROLLER]: {
            channel: Channel;
            channelMetadata: ChannelMetadata;
        };
    }
}

declare module '../../node_modules/alexa-smarthome-ts/lib/base/Directives' {
    interface Directives {
        [CHANNEL_CONTROLLER]: {
            [CHANGE_CHANNEL_DIRECTIVE]: true;
            [SKIP_CHANNELS_DIRECTIVE]: true;
        };
    }
}

declare module '../../node_modules/alexa-smarthome-ts/lib/base/Payloads' {
    interface Payloads {
        [CHANGE_CHANNEL_DIRECTIVE]: {
            channel: Channel;
            channelMetadata: ChannelMetadata;
        };
        [SKIP_CHANNELS_DIRECTIVE]: {
            channelCount: number;
        };
    }
}