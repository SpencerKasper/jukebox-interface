import React, {useEffect, useState} from "react";
import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";
import jukeboxReduxStore from "./redux/jukebox-redux-store";
import {SearchResultsPage} from "./SearchResultsPage";
import {ConnectingToPiView} from "./ConnectingToPiView";
import {CurrentlyPlayingToolbar} from "./CurrentlyPlayingToolbar";

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
                const playlists = await SingletonMopidyPlaybackManager.getListOfPlaylists();
                const tracksInPlaylist = await SingletonMopidyPlaybackManager.getTracksInPlaylist(playlists[10].uri);
                const trackToPlay = await SingletonMopidyPlaybackManager.search('uri', tracksInPlaylist[0].uri);
                await SingletonMopidyPlaybackManager.addSongToQueue(trackToPlay[0].tracks[0]);
                console.error(trackToPlay[0].tracks[0]);
                console.error(tracksInPlaylist);
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
        <CurrentlyPlayingToolbar/>
        {isConnected ?
            <SearchResultsPage/> :
            <ConnectingToPiView/>}
    </div>;
}