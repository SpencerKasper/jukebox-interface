import {Menu, MenuItem} from "@material-ui/core";
import {useSelector} from 'react-redux';
import React from "react";
import jukeboxReduxStore, {JukeboxReduxStore} from "../redux/jukebox-redux-store";
import {SingletonMopidyPlaybackManager} from "../SingletonMopidyPlaybackManager";
import {toast} from "react-toastify";

export function TrackPlaybackMenu() {
    const trackPlaybackMenuState = useSelector((state: JukeboxReduxStore) => {
        return ({searchResults: state.searchResults});
    });

    const addSongAtIndexToQueue = async () => {
        const {searchResults} = trackPlaybackMenuState;
        const {currentlyViewingIndex, tracks} = searchResults;
        const track = tracks[currentlyViewingIndex];
        jukeboxReduxStore.dispatch({
            type: 'playback/changeMode',
            payload: {mode: 'community'},
        });
        await SingletonMopidyPlaybackManager.addSongToQueue(track);
    }

    const handlePopoverClose = () => {
        // Turn into reset action that we dispatch.
        jukeboxReduxStore.dispatch({
            type: 'searchResults/actOnSearchResult',
            payload: {currentlyViewingIndex: null, selectedTrackDivToAnchorOn: null},
        });
    };

    async function dispatchCurrentlyPlayingChanged() {
        const currentlyPlayingTrack = await SingletonMopidyPlaybackManager.getCurrentlyPlayingTrackInfo();
        const currentPlaybackTime = await SingletonMopidyPlaybackManager.getCurrentPlaybackTime();

        jukeboxReduxStore.dispatch({
            type: 'playback/play',
            payload: {playbackTime: currentPlaybackTime, currentlyPlayingTrack, mode: 'community'}
        });
    }

    const playSongAtIndex = async () => {
        const {searchResults} = trackPlaybackMenuState;
        const {currentlyViewingIndex, tracks} = searchResults;
        const track = tracks[currentlyViewingIndex];
        await SingletonMopidyPlaybackManager.clearAllAndPlay(track);
        toast(`Erased queue and now playing ${track.name} by ${track.artists[0].name}`, {
            type: 'info',
        });
        // update mode to community
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