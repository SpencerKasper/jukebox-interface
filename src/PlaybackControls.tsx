import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";
import React from "react";
import {Button} from "@material-ui/core";

export function PlaybackControls() {
    return <div className={'playback-controls'}>
        <Button onClick={SingletonMopidyPlaybackManager.playNextSongInQueue}>
            Next song
        </Button>
        <Button onClick={SingletonMopidyPlaybackManager.resume}>
            Resume
        </Button>
        <Button onClick={SingletonMopidyPlaybackManager.pause}>
            Pause
        </Button>
        <Button onClick={SingletonMopidyPlaybackManager.stop}>
            Stop
        </Button>
    </div>;
}