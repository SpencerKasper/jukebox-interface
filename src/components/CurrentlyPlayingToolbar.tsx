import CurrentlyPlayingTrackInfo from "./CurrentlyPlayingTrackInfo";
import PlaybackControls from "./PlaybackControls";
import {VolumeControls} from "./VolumeControls";
import React from "react";

export function CurrentlyPlayingToolbar() {
    return <div className={"currently-playing-toolbar"}>
        <CurrentlyPlayingTrackInfo/>
        <PlaybackControls/>
        <VolumeControls/>
    </div>;
}