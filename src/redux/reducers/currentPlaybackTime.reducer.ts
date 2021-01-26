import {SingletonMopidyPlaybackManager} from "../../SingletonMopidyPlaybackManager";
import currentPlaybackTimeStore from "../stores/currentPlaybackTime.store";

const initialState = {
    playbackTime: 0,
};

let interval;

const beginPlaybackTimeQueryLoop = () => {
    interval = setInterval(async () => {
        const playbackTime = await SingletonMopidyPlaybackManager.getCurrentPlaybackTime();
        currentPlaybackTimeStore.dispatch({type: 'playback/updateTime', payload: {playbackTime}});
    }, 1000);
}

const cancelPlaybackTimeQueryLoop = () => {
    clearInterval(interval);
}

export default function currentPlaybackTimeReducer(state = initialState, action) {
    switch (action.type) {
        case 'playback/play':
            beginPlaybackTimeQueryLoop();
            return {
                ...state,
                playbackTime: action.payload,
            }
        case 'playback/updateTime': {
            return {
                ...state,
                playbackTime: action.payload
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