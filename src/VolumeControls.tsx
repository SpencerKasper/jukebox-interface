import {JukeboxSlider} from "./theme/JukeboxSlider";
import React, {useState} from "react";
import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";
import unmuted from './static/images/unmuted.svg';
import muted from './static/images/muted.svg';

export function VolumeControls() {
    const [volumeState, updateVolume] = useState({isMute: false, volume: 100});

    return <div className={"to-center-playback"}>
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
            <div className={'mute-button'}
                 onClick={async () => {
                     const shouldMute = !volumeState.isMute;
                     await SingletonMopidyPlaybackManager.setMute(shouldMute);
                     updateVolume({...volumeState, isMute: shouldMute});
                 }}>
                <img src={volumeState.isMute ? muted : unmuted} height={36} width={36}/>
            </div>
        </div>
    </div>;
}