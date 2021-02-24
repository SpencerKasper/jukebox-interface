import {JukeboxSlider} from "./theme/JukeboxSlider";
import React, {useState} from "react";
import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";
import {IconButton} from "@material-ui/core";
import {VolumeMute, VolumeUp} from "@material-ui/icons";

export function VolumeControls() {
    const [volumeState, updateVolume] = useState({isMute: false, volume: 100});

    const toggleMute = async () => {
        const shouldMute = !volumeState.isMute;
        await SingletonMopidyPlaybackManager.setMute(shouldMute);
        updateVolume({...volumeState, isMute: shouldMute});
    }

    return (<div className={"to-center-playback"}>
        <div className={'volume-controls'}>
            <div className={'volume-slider'}>
                <JukeboxSlider
                    defaultValue={volumeState.isMute ? 0 : volumeState.volume}
                    step={1}
                    min={0}
                    max={100}
                    onChangeCommitted={async (event, newValue) => {
                        await SingletonMopidyPlaybackManager.setVolume(newValue);
                        updateVolume({...volumeState, volume: newValue});
                    }}
                    valueLabelFormat={(value) => value}/>
            </div>
            <IconButton onClick={toggleMute}>
                {volumeState.isMute ? <VolumeMute/> : <VolumeUp/>}
            </IconButton>
        </div>
    </div>);
}