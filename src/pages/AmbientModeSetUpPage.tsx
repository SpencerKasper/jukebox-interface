import React, {useEffect, useState} from 'react';
import {CurrentlyPlayingToolbar} from "../components/CurrentlyPlayingToolbar";
import {SingletonMopidyPlaybackManager} from "../SingletonMopidyPlaybackManager";
import PlaylistImage from "../components/PlaylistImage";
import {ConnectingToPiView} from "../views/ConnectingToPiView";
import axios from "axios";
import {useSelector} from 'react-redux';
import {toast} from "react-toastify";
import {JukeboxReduxStore} from "../redux/jukebox-redux-store";

const AmbientModeSetUpPage = ({isConnected}) => {
    const [playlists, updatePlaylists] = useState([]);
    const currentlyPlayingTrackInfo = useSelector((state: JukeboxReduxStore) => state.playback.currentlyPlayingTrack.trackInfo);

    async function trySetUp() {
        if (isConnected) {
            updatePlaylists(await SingletonMopidyPlaybackManager.getListOfPlaylists());
        }
    }

    async function addSongsInPlaylistToAmbientQueue(playlist) {
        const tracks = await SingletonMopidyPlaybackManager.getTracksInPlaylist(playlist.uri);
        const trackUris = tracks.map(track => track.uri);
        await axios.post(`${process.env.REACT_APP_JUKEBOX_API_DOMAIN}ambientQueue/update`, {
            ambientQueue: trackUris,
            owner: 'Spencer Kasper',
            currentPlayingTrackUri: currentlyPlayingTrackInfo ? currentlyPlayingTrackInfo.uri : '',
        });
        const messageForToast = `Added ${trackUris.length} song(s) to the ambient queue.`;
        toast(messageForToast, {
            type: 'success',
        })
    }

    useEffect(() => {
        trySetUp();
    }, [isConnected]);
    return (
        isConnected ? <div className={'ambient-mode-set-up-page page-with-toolbar'}>
                <div className={'playlist-list-container'}>
                    {playlists.map(playlist => {
                        return <div className={'playlist-list-item'}
                                    onClick={() => addSongsInPlaylistToAmbientQueue(playlist)}>
                            <PlaylistImage playlistUri={playlist.uri}/>
                            <div className={'playlist-title'}>
                                {playlist.name}
                            </div>
                        </div>
                    })}
                </div>
                <CurrentlyPlayingToolbar/>
            </div> :
            <ConnectingToPiView/>
    );
};

export default AmbientModeSetUpPage;