import React, {useEffect, useState} from 'react';
import {CurrentlyPlayingToolbar} from "../components/CurrentlyPlayingToolbar";
import {SingletonMopidyPlaybackManager} from "../SingletonMopidyPlaybackManager";
import PlaylistImage from "../components/PlaylistImage";
import {ConnectingToPiView} from "../views/ConnectingToPiView";

const AmbientModeSetUpPage = ({isConnected}) => {
    const [playlists, updatePlaylists] = useState([]);

    async function trySetUp() {
        if (isConnected) {
            updatePlaylists(await SingletonMopidyPlaybackManager.getListOfPlaylists());
        }
    }

    async function addSongsInPlaylistToQueue(playlist) {
        const tracks = await SingletonMopidyPlaybackManager.getTracksInPlaylist(playlist.uri);
        for (let track of tracks) {
            const fullTrack = await SingletonMopidyPlaybackManager.search('uri', track.uri);
            await SingletonMopidyPlaybackManager.addSongToQueue(fullTrack[0].tracks[0]);
        }
    }

    useEffect(() => {
        trySetUp();
    }, [isConnected]);
    return (
        isConnected ? <div className={'ambient-mode-set-up-page page-with-toolbar'}>
                <div className={'playlist-list-container'}>
                    {playlists.map(playlist => {
                        return <div className={'playlist-list-item'} onClick={() => addSongsInPlaylistToQueue(playlist)}>
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