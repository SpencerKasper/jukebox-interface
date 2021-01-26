import { createStore } from 'redux'
import currentPlaybackTimeReducer from "../reducers/currentPlaybackTime.reducer";

const currentPlaybackTimeStore = createStore(currentPlaybackTimeReducer, {playbackTime: 0});

export default currentPlaybackTimeStore