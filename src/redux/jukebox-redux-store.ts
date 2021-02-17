import {combineReducers, createStore} from 'redux'
import playbackReducer from "./reducers/playback.reducer";
import searchResultsReducer from "./reducers/search-results.reducer";

const jukeboxReduxStore = createStore(
    combineReducers({
        playback: playbackReducer,
        searchResults: searchResultsReducer,
    })
);

export default jukeboxReduxStore