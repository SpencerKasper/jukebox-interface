import {SingletonMopidyPlaybackManager} from "../../SingletonMopidyPlaybackManager";
import jukeboxReduxStore from "../jukebox-redux-store";

interface PlaybackReducerState {
    playbackTime: number;
    currentlyPlayingTrack: {
        trackImage: string;
        trackInfo: any;
    };
    mode: 'ambient' | 'community';
}

const initialState: PlaybackReducerState = {
    playbackTime: 0,
    currentlyPlayingTrack: {
        trackImage: undefined,
        trackInfo: undefined,
    },
    mode: 'ambient',
};

let interval;

const beginPlaybackTimeQueryLoop = () => {
    interval = setInterval(async () => {
        const playbackTime = await SingletonMopidyPlaybackManager.getCurrentPlaybackTime();
        jukeboxReduxStore.dispatch({type: 'playback/updateTime', payload: {playbackTime}});
    }, 1000);
}

const cancelPlaybackTimeQueryLoop = () => {
    clearInterval(interval);
}

export default function playbackReducer(state = initialState, action) {
    switch (action.type) {
        case 'playback/changeMode':
            return {
                ...state,
                mode: action.payload.mode,
            }
        case 'playback/play':
            beginPlaybackTimeQueryLoop();
            return {
                ...state,
                playbackTime: action.payload.playbackTime,
                ...(action.payload.currentlyPlayingTrack && {currentlyPlayingTrack: action.payload.currentlyPlayingTrack}),
                ...(action.payload.mode && {mode: action.payload.mode}),
            }
        case 'playback/updateTime': {
            return {
                ...state,
                playbackTime: action.payload.playbackTime
            }
        }
        case 'playback/stop': {
            cancelPlaybackTimeQueryLoop();
            return {
                ...state,
            }
        }
        default:
            return state
    }
}