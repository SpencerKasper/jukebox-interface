import React from 'react';
import {FormControlLabel, Switch} from "@material-ui/core";
import {useSelector} from "react-redux";
import {JukeboxReduxStore} from "../redux/jukebox-redux-store";

const PlaybackModeSwitch = () => {
    const playbackMode = useSelector((state: JukeboxReduxStore) => state.playback.mode);

    function isAmbientMode() {
        return playbackMode === 'ambient';
    }

    return (
        <div style={{paddingLeft: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <div>Playback Mode: {playbackMode.toUpperCase()}</div>
        </div>
    );
};

export default PlaybackModeSwitch;