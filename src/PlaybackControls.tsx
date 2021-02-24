import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";
import React from "react";
import {JukeboxSlider} from "./theme/JukeboxSlider";
import {useSelector} from 'react-redux';
import jukeboxReduxStore from "./redux/jukebox-redux-store";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import {IconButton} from "@material-ui/core";
import {Pause, Stop} from "@material-ui/icons";

function PlaybackControls() {
    const playbackState = useSelector((state) => state.playback);
    const totalSongLengthInSeconds = playbackState.currentlyPlayingTrack && playbackState.currentlyPlayingTrack.trackInfo ?
        playbackState.currentlyPlayingTrack.trackInfo.length :
        0;

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
                jukeboxReduxStore.dispatch({type: 'playback/stop'});
            }} onMouseUp={async () => {
                const resumePlaybackTime = await SingletonMopidyPlaybackManager.getCurrentPlaybackTime();
                jukeboxReduxStore.dispatch({type: 'playback/play', payload: {playbackTime: resumePlaybackTime}})
            }} onChangeCommitted={async (event, newValue) => {
                await SingletonMopidyPlaybackManager.seek(newValue as number);
            }} valueLabelFormat={getLabelValueFormatter()}/>
            <div className={'playback-buttons'}>
                <IconButton onClick={SingletonMopidyPlaybackManager.resume}>
                    <PlayArrowIcon width={32} height={32}/>
                </IconButton>
                <IconButton onClick={SingletonMopidyPlaybackManager.pause}>
                    <Pause width={32} height={32}/>
                </IconButton>
                <IconButton onClick={SingletonMopidyPlaybackManager.stop}>
                    <Stop width={32} height={32}/>
                </IconButton>
                <IconButton onClick={SingletonMopidyPlaybackManager.playNextSongInQueue}>
                    <SkipNextIcon/>
                </IconButton>
            </div>
        </div>
    );
}

export default PlaybackControls;