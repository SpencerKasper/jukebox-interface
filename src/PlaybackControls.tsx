import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";
import React from "react";

export function PlaybackControls() {
    return <div>
        <button onClick={SingletonMopidyPlaybackManager.playNextSongInQueue}>
            Next song.
        </button>
        <button onClick={SingletonMopidyPlaybackManager.resume}>
            Resume.
        </button>
        <button onClick={SingletonMopidyPlaybackManager.pause}>
            Pause.
        </button>
        <button onClick={SingletonMopidyPlaybackManager.stop}>
            Stop.
        </button>
    </div>;
}