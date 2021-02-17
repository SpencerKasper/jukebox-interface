import React, {useEffect, useState} from "react";
import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";
import PlaybackControls from "./PlaybackControls";
import {VolumeControls} from "./VolumeControls";
import jukeboxReduxStore from "./redux/jukebox-redux-store";
import {SearchResultsPage} from "./SearchResultsPage";
import CurrentlyPlayingTrackInfo from "./components/CurrentlyPlayingTrackInfo";

export function JukeboxWebInterface() {
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

    useEffect(() => {
        SingletonMopidyPlaybackManager.startMopidy({
            online: async () => {
                await SingletonMopidyPlaybackManager.getListOfPlaylists();
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

    const performDefaultSearch = async (searchTerm) => {
        const result = await SingletonMopidyPlaybackManager.search('artist', searchTerm);
        const allTracks = result[0].tracks;
        const searchResultImages = await SingletonMopidyPlaybackManager.getImagesForTracks(allTracks);
        jukeboxReduxStore.dispatch({
            type: 'searchResults/setSearchResults',
            payload: {tracks: allTracks, images: searchResultImages}
        });
    }

    return <div className={'jukebox-web-interface'}>
        <div className={'currently-playing-toolbar'}>
            <CurrentlyPlayingTrackInfo/>
            <PlaybackControls/>
            <VolumeControls/>
        </div>
        {isConnected ?
            <SearchResultsPage /> :
            <div>
                Please wait while we get your device set up.
            </div>}
    </div>;
}