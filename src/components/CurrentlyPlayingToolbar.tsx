import CurrentlyPlayingTrackInfo from "./CurrentlyPlayingTrackInfo";
import PlaybackControls from "./PlaybackControls";
import {VolumeControls} from "./VolumeControls";
import React from "react";
import PlaybackModeSwitch from "./PlaybackModeSwitch";

export function CurrentlyPlayingToolbar() {
    return <div className={"currently-playing-toolbar"}>
        <PlaybackModeSwitch />
        <CurrentlyPlayingTrackInfo/>
        <PlaybackControls/>
        <VolumeControls/>
    </div>;
}