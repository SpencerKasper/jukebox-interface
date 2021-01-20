import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";
import React, {useState} from "react";
import nextButtonSvg from './static/images/next-button.svg';
import pauseButtonSvg from './static/images/pause-button.svg';
import stopButtonSvg from './static/images/stop-button.svg';
import resumeButtonSvg from './static/images/play-button.svg';
import {Slider, withStyles} from "@material-ui/core";

export function PlaybackControls({currentlyPlayingTrack}) {
    const StyledSlider = withStyles({
        root: {
            color: 'black',
            height: 8,
        }
    })(Slider);
    const totalSongLengthInSeconds = currentlyPlayingTrack ?
        currentlyPlayingTrack.length :
        0;
    return (
        <div className={'playback-controls'}>
            <div className={'slider'}>
                <StyledSlider
                    defaultValue={0}
                    step={1}
                    min={0}
                    max={totalSongLengthInSeconds}
                    onChangeCommitted={(event, newValue) => {
                        console.error('change committed: ', newValue);
                        return SingletonMopidyPlaybackManager.seek(newValue as number);
                    }}
                    valueLabelFormat={(value) => {
                        const totalSeconds = value / 1000;
                        const totalMinutes = (totalSeconds / 60).toFixed(1).split('.')[0];
                        const totalMinutesInSeconds = Number(totalMinutes) * 60;
                        let seconds = ((totalSeconds - totalMinutesInSeconds)).toFixed(0);
                        if(Number(seconds) < 10){
                            seconds = `0${seconds}`
                        }
                        return `${totalMinutes}:${seconds}`;
                    }}
                    valueLabelDisplay={'auto'}
/>
            </div>
            <div className={'playback-buttons'}>
                <div className={'playback-svg'}>
                    <img
                        alt={'resume'}
                        src={resumeButtonSvg}
                        width={32}
                        height={32}
                        onClick={SingletonMopidyPlaybackManager.resume}/>
                </div>
                <div className={'playback-svg'}>
                    <img alt={'pause'}
                         src={pauseButtonSvg}
                         width={48}
                         height={48}
                         onClick={SingletonMopidyPlaybackManager.pause}/>
                </div>
                <div className={'playback-svg'}>
                    <img alt={'stop'}
                         src={stopButtonSvg}
                         width={24}
                         height={24}
                         onClick={SingletonMopidyPlaybackManager.stop}/>
                </div>
                <div className={'playback-svg'}>
                    <img
                        alt={'next'}
                        src={nextButtonSvg}
                        width={32}
                        height={32}
                        onClick={SingletonMopidyPlaybackManager.playNextSongInQueue}/>
                </div>
            </div>
        </div>
    );
}