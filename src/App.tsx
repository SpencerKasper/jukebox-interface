import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './static/scss/App.scss';
import {JukeboxHomePage} from "./pages/JukeboxHomePage";
import AmbientModeSetUpPage from "./pages/AmbientModeSetUpPage";
import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";
import jukeboxReduxStore, {JukeboxReduxStore} from "./redux/jukebox-redux-store";
import {Sidebar} from "./components/Sidebar";
import axios from "axios";
import {toast} from "react-toastify";
import {useSelector} from 'react-redux';
import {getGetAmbientQueueEndpoint, getNextSongInAmbientQueueEndpoint} from "./apiEndpoints/ambient-queue-endpoints";

const OWNER = 'Spencer Kasper';
function App() {
    const [isConnected, updateIsConnected] = useState(false);

    const playbackMode = useSelector((state: JukeboxReduxStore) => (state.playback.mode));
    async function dispatchCurrentlyPlayingChanged() {
        const currentlyPlayingTrack = await SingletonMopidyPlaybackManager.getCurrentlyPlayingTrackInfo();

        const currentPlaybackTime = await SingletonMopidyPlaybackManager.getCurrentPlaybackTime();
        jukeboxReduxStore.dispatch({
            type: 'playback/play',
            payload: {playbackTime: currentPlaybackTime, currentlyPlayingTrack, mode: 'community'}
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
    async function startAmbientMode() {
        const response = await axios.get(getGetAmbientQueueEndpoint(OWNER));
        for (let uri of response.data.ambientQueue) {
            const fullTrack = await SingletonMopidyPlaybackManager.search('uri', uri);
            await SingletonMopidyPlaybackManager.addSongToQueue(fullTrack[0].tracks[0]);
        }
        const updatedAmbientQueue = await axios.post(getNextSongInAmbientQueueEndpoint(OWNER));
        console.error(updatedAmbientQueue);
    }

    useEffect(() => {
        SingletonMopidyPlaybackManager.startMopidy({
            online: async () => {
                await performDefaultSearch('Mac Miller');
                const playbackState = await SingletonMopidyPlaybackManager.getPlaybackState();
                const currentQueue = await SingletonMopidyPlaybackManager.getQueue();
                console.error(`${playbackState} ${playbackMode}`)
                if (playbackState === 'playing') {
                    await dispatchCurrentlyPlayingChanged();
                } else if (playbackMode === 'ambient') {
                    await startAmbientMode();
                    await dispatchCurrentlyPlayingChanged();
                }
                updateIsConnected(true);
            },
            offline: async () => {
                toast('Looks like we got disconnected from the jukebox🤬! Trying to reconnect...', {
                    type: 'warning',
                });
                updateIsConnected(false);
            },
            trackPlaybackStarted: async () => {
                if(playbackMode === 'ambient'){
                    await axios.post(getNextSongInAmbientQueueEndpoint(OWNER));
                }
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
                    <Sidebar/>
                    <JukeboxHomePage isConnected={isConnected}/>
                </Route>
                <Route path='/ambientSetUp'>
                    <Sidebar/>
                    <AmbientModeSetUpPage isConnected={isConnected}/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
