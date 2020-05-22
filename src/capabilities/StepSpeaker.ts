export declare const STEP_SPEAKER = "Alexa.StepSpeaker";
export declare const ADJUST_VOLUME_DIRECTIVE = "AdjustVolume";
export declare const SET_MUTE_DIRECTIVE = "SetMute";

declare module '../../node_modules/alexa-smarthome-ts/lib/base/Capabilities' {
    interface Capabilities {
        [STEP_SPEAKER]: true;
    }
}
declare module '../../node_modules/alexa-smarthome-ts/lib/base/Directives' {
    interface Directives {
        [STEP_SPEAKER]: {
            [ADJUST_VOLUME_DIRECTIVE]: true;
            [SET_MUTE_DIRECTIVE]: true;
        };
    }
}
declare module '../../node_modules/alexa-smarthome-ts/lib/base/Payloads' {
    interface Payloads {
        [ADJUST_VOLUME_DIRECTIVE]: {
            volumeSteps: number
        };
        [SET_MUTE_DIRECTIVE]: {
            mute: boolean
        };
    }
}
