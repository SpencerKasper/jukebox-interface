import React, {useEffect, useState} from "react";
import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";
import PlaybackControls from "./PlaybackControls";
import {VolumeControls} from "./VolumeControls";
import jukeboxReduxStore from "./redux/jukebox-redux-store";
import {WebInterfacePageThing} from "./WebInterfacePageThing";
import CurrentlyPlayingTrackInfo from "./components/CurrentlyPlayingTrackInfo";

const mopidy = SingletonMopidyPlaybackManager.getMopidyInstance();


export function JukeboxWebInterface() {
    const [searchResults, updateSearchResults] = useState([]);
    const [isConnected, updateIsConnected] = useState(false);
    const [searchResultImages, updateSearchResultTrackImages] = useState({});
    const [currentlyViewingIndex, updateCurrentlyViewingIndex] = useState(null);

    async function getCurrentlyPlayingTrackInfo() {
        const trackInfo = await SingletonMopidyPlaybackManager.getCurrentlyPlayingTrack();
        const trackImage = await SingletonMopidyPlaybackManager.getImagesForTracks([trackInfo]);
        return {
            trackInfo,
            trackImage,
        };
    }

    async function dispatchCurrentlyPlayingChanged() {
        const currentlyPlayingTrack = await getCurrentlyPlayingTrackInfo();
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

    const fetch = async () => {
        const searchResultImages = await SingletonMopidyPlaybackManager.getImagesForTracks(searchResults);
        updateSearchResultTrackImages(searchResultImages);
    }

    useEffect(() => {
        fetch();
    }, [searchResults]);

    const performDefaultSearch = async (searchTerm) => {
        const result = await SingletonMopidyPlaybackManager.search('artist', searchTerm);
        const allTracks = result[0].tracks;
        updateSearchResults(allTracks);
    }

    const playSongAtIndex = async (index) => {
        const track = searchResults[index];
        await SingletonMopidyPlaybackManager.clearAllAndPlay(track);
        await dispatchCurrentlyPlayingChanged();
    }

    const addSongAtIndexToQueue = async (index) => {
        const track = searchResults[index];
        await SingletonMopidyPlaybackManager.addSongToQueue(track);
    }

    const [anchorEl, setAnchorEl] = React.useState<HTMLImageElement | null>(null);

    const handleSongClick = (event: React.MouseEvent<HTMLImageElement>, index: number) => {
        updateCurrentlyViewingIndex(index);
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        updateCurrentlyViewingIndex(null);
        setAnchorEl(null);
    };

    return <div className={'jukebox-web-interface'}>
        <div className={'currently-playing-toolbar'}>
            <CurrentlyPlayingTrackInfo />
            <PlaybackControls />
            <VolumeControls/>
        </div>
        {isConnected ?
            <WebInterfacePageThing updateTracks={updateSearchResults} searchResults={searchResults}
                                searchResultImages={searchResultImages} callbackfn={(track, index) => {
            const imageUrl = searchResultImages && searchResultImages[track.uri] ?
                searchResultImages[track.uri][0].uri :
                '';
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px',
                    alignItems: 'center',
                    width: '20%'
                }}>
                    <div>
                        <img
                            id={`album-art-${index}`}
                            onClick={(event) => handleSongClick(event, index)}
                            src={imageUrl}
                            alt={'album art'}
                            width={200}
                            height={200}
                        />
                    </div>
                    <div>
                        {track.name} - {track.artists[0].name}
                    </div>
                </div>
            )
        }} anchorEl={anchorEl} onClose={handlePopoverClose} onClick={() => {
            handlePopoverClose();
            return playSongAtIndex(currentlyViewingIndex);
        }} onClick1={() => {
            handlePopoverClose();
            return addSongAtIndexToQueue(currentlyViewingIndex);
        }}/> :
        <div>
            Please wait while we get your device set up.
        </div>}
    </div>;
}