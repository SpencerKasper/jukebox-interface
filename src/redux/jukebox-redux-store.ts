import {combineReducers, createStore} from 'redux'
import playbackReducer from "./reducers/playback.reducer";

const jukeboxReduxStore = createStore(
    combineReducers({
        playback: playbackReducer,
    })
);

export default jukeboxReduxStore