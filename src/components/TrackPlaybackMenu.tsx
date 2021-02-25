import {Menu, MenuItem} from "@material-ui/core";
import {useSelector} from 'react-redux';
import React from "react";
import jukeboxReduxStore from "../redux/jukebox-redux-store";
import {SingletonMopidyPlaybackManager} from "../SingletonMopidyPlaybackManager";

export function TrackPlaybackMenu() {
    const trackPlaybackMenuState = useSelector((state) => {
        return ({searchResults: state.searchResults});
    });

    const addSongAtIndexToQueue = async () => {
        const {searchResults} = trackPlaybackMenuState;
        const {currentlyViewingIndex, tracks} = searchResults;
        const track = tracks[currentlyViewingIndex];
        await SingletonMopidyPlaybackManager.addSongToQueue(track);
    }

    const handlePopoverClose = () => {
        // Turn into reset action that we dispatch.
        jukeboxReduxStore.dispatch({
            type: 'searchResults/actOnSearchResult',
            payload: {currentlyViewingIndex: null, selectedTrackDivToAnchorOn: null},
        })
    };

    async function dispatchCurrentlyPlayingChanged() {
        const currentlyPlayingTrack = await SingletonMopidyPlaybackManager.getCurrentlyPlayingTrackInfo();
        const currentPlaybackTime = await SingletonMopidyPlaybackManager.getCurrentPlaybackTime();

        jukeboxReduxStore.dispatch({
            type: 'playback/play',
            payload: {playbackTime: currentPlaybackTime, currentlyPlayingTrack}
        })
    }

    const playSongAtIndex = async () => {
        const {searchResults} = trackPlaybackMenuState;
        const {currentlyViewingIndex, tracks} = searchResults;
        const track = tracks[currentlyViewingIndex];
        console.error('playing: ', track);
        await SingletonMopidyPlaybackManager.clearAllAndPlay(track);
        await dispatchCurrentlyPlayingChanged();
    }

    return <Menu
        anchorEl={trackPlaybackMenuState.searchResults.selectedTrackDivToAnchorOn}
        keepMounted
        open={Boolean(trackPlaybackMenuState.searchResults.selectedTrackDivToAnchorOn)}
        onClose={handlePopoverClose}
    >
        <MenuItem onClick={playSongAtIndex}>Play</MenuItem>
        <MenuItem onClick={addSongAtIndexToQueue}>Add to Queue</MenuItem>
    </Menu>;
}