import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";
import React, {useEffect, useState} from "react";
import nextButtonSvg from './static/images/next-button.svg';
import pauseButtonSvg from './static/images/pause-button.svg';
import stopButtonSvg from './static/images/stop-button.svg';
import resumeButtonSvg from './static/images/play-button.svg';

export function PlaybackControls() {
    return <div className={'playback-controls'}>
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
    </div>;
}