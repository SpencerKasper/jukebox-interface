import {combineReducers, createStore} from 'redux'
import playbackReducer from "./reducers/playback.reducer";
import searchResultsReducer from "./reducers/search-results.reducer";

export interface JukeboxReduxStore {
    playback: any;
    searchResults: any;
}

const reducers: JukeboxReduxStore = {
    playback: playbackReducer,
    searchResults: searchResultsReducer,
};
const jukeboxReduxStore = createStore(
    combineReducers(reducers)
);

export default jukeboxReduxStore