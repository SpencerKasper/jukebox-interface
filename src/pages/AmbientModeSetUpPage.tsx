import React from 'react';
import PlaybackControls from "../PlaybackControls";
import {TrackPlaybackMenu} from "../TrackPlaybackMenu";
import {CurrentlyPlayingToolbar} from "../CurrentlyPlayingToolbar";

const AmbientModeSetUpPage = () => {
    return (
        <div className={'ambient-mode-set-up-page'}>
            <CurrentlyPlayingToolbar />
        </div>
    );
};

export default AmbientModeSetUpPage;