import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";
import React from "react";
import nextButtonSvg from './static/images/next-button.svg';
import pauseButtonSvg from './static/images/pause-button.svg';
import stopButtonSvg from './static/images/stop-button.svg';
import resumeButtonSvg from './static/images/play-button.svg';
import {JukeboxSlider} from "./theme/JukeboxSlider";
import {useSelector} from 'react-redux';
import jukeboxReduxStore from "./redux/jukebox-redux-store";

function PlaybackControls() {
    const playbackState = useSelector((state) => state.playback);
    console.error(playbackState);
    const totalSongLengthInSeconds = playbackState.currentlyPlayingTrack && playbackState.currentlyPlayingTrack.trackInfo ?
        playbackState.currentlyPlayingTrack.trackInfo.length :
        0;
    console.error(`total: ${totalSongLengthInSeconds}`)

    const getLabelValueFormatter = () => (value) => {
        const totalSeconds = value / 1000;
        const totalMinutes = (totalSeconds / 60).toString().split('.')[0];
        const totalMinutesInSeconds = Number(totalMinutes) * 60;
        let seconds = ((totalSeconds - totalMinutesInSeconds)).toFixed(0);
        if (Number(seconds) < 10) {
            seconds = `0${seconds}`
        }
        return `${totalMinutes}:${seconds}`;
    };

    return (
        <div className={'playback-controls'}>
            <JukeboxSlider defaultValue={playbackState.playbackTime}
                           min={0} step={1} max={totalSongLengthInSeconds} onMouseDown={() => {
                console.error('stop');
                jukeboxReduxStore.dispatch({type: 'playback/stop'});
            }} onMouseUp={async () => {
                console.error('play')
                const resumePlaybackTime = await SingletonMopidyPlaybackManager.getCurrentPlaybackTime();
                jukeboxReduxStore.dispatch({type: 'playback/play', payload: {playbackTime: resumePlaybackTime}})
            }} onChangeCommitted={async (event, newValue) => {
                console.error('commit');
                await SingletonMopidyPlaybackManager.seek(newValue as number);
            }} valueLabelFormat={getLabelValueFormatter()}/>
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

export default PlaybackControls;