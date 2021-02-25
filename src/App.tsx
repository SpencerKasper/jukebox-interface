import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './static/scss/App.scss';
import {JukeboxHomePage} from "./pages/JukeboxHomePage";
import AmbientModeSetUpPage from "./pages/AmbientModeSetUpPage";
import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";
import jukeboxReduxStore from "./redux/jukebox-redux-store";
import {Sidebar} from "./components/Sidebar";

function App() {
    const [isConnected, updateIsConnected] = useState(false);

    async function dispatchCurrentlyPlayingChanged() {
        const currentlyPlayingTrack = await SingletonMopidyPlaybackManager.getCurrentlyPlayingTrackInfo();
        const currentPlaybackTime = await SingletonMopidyPlaybackManager.getCurrentPlaybackTime();

        jukeboxReduxStore.dispatch({
            type: 'playback/play',
            payload: {playbackTime: currentPlaybackTime, currentlyPlayingTrack}
        })
    }

    function dispatchStopPlaybackTimer() {
        jukeboxReduxStore.dispatch({type: 'playback/stop'});
    }

    const performDefaultSearch = async (searchTerm) => {
        const result = await SingletonMopidyPlaybackManager.search('artist', searchTerm);
        const allTracks = result[0].tracks;
        const searchResultImages = await SingletonMopidyPlaybackManager.getImagesForTracks(allTracks);
        jukeboxReduxStore.dispatch({
            type: 'searchResults/setSearchResults',
            payload: {tracks: allTracks, images: searchResultImages}
        });
    }

    useEffect(() => {
        SingletonMopidyPlaybackManager.startMopidy({
            online: async () => {
                await performDefaultSearch('Mac Miller');
                if (await SingletonMopidyPlaybackManager.getPlaybackState() === 'playing') {
                    await dispatchCurrentlyPlayingChanged();
                }
                updateIsConnected(true);
            },
            offline: async () => {
                updateIsConnected(false);
            },
            trackPlaybackStarted: async () => {
                await dispatchCurrentlyPlayingChanged()
            },
            trackPlaybackEnded: async () => {
                dispatchStopPlaybackTimer();
            },
            playbackStateChanged: async ({old_state, new_state}) => {
            }
        })
    }, []);

    return (
        <Router>
            <Switch>
                <Route exact path='/'>
                    <Sidebar />
                    <JukeboxHomePage isConnected={isConnected}/>
                </Route>
                <Route path='/ambientSetUp'>
                    <Sidebar />
                    <AmbientModeSetUpPage isConnected={isConnected}/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
