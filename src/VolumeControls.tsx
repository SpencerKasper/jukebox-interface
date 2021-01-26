import {JukeboxSlider} from "./theme/JukeboxSlider";
import React, {useEffect, useState} from "react";
import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";

export function VolumeControls() {
    const [volumeState, updateVolume] = useState({isMute: false, volume: 100});

    return <div className={"to-center-playback"}>
        <div className={'volume-slider'}>
            <JukeboxSlider
                defaultValue={volumeState.volume}
                step={1}
                min={0}
                max={100}
                onChangeCommitted={async (event, newValue) => {
                    await SingletonMopidyPlaybackManager.setVolume(newValue);
                    updateVolume({isMute: false, volume: newValue});
                }}
                valueLabelFormat={(value) => value}/>
            <p>
                Volume
            </p>
        </div>
    </div>;
}