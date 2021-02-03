import React, {useEffect, useState} from "react";
import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";
import {TrackPlaybackMenu} from "./TrackPlaybackMenu";
import PlaybackControls from "./PlaybackControls";
import {SearchBar} from "./SearchBar";
import {VolumeControls} from "./VolumeControls";
import jukeboxReduxStore from "./redux/jukebox-redux-store";
import {WebInterfacePageThing} from "./WebInterfacePageThing";
import CurrentlyPlayingTrackInfo from "./components/CurrentlyPlayingTrackInfo";

const mopidy = SingletonMopidyPlaybackManager.getMopidyInstance();


export function JukeboxWebInterface() {
    const [searchResults, updateSearchResults] = useState([]);
    const [isConnected, updateIsConnected] = useState(false);
    const [currentlyPlayingTrack, updateCurrentlyPlayingTrack] = useState(null);
    const [currentlyPlayingTrackImage, updateCurrentlyPlayingTrackImage] = useState({});
    const [searchResultImages, updateSearchResultTrackImages] = useState({});
    const [currentlyViewingIndex, updateCurrentlyViewingIndex] = useState(null);

    async function updateCurrentlyPlayingTrackInfo() {
        const trackInfo = await SingletonMopidyPlaybackManager.getCurrentlyPlayingTrack();
        updateCurrentlyPlayingTrack(trackInfo);
        const trackImage = await SingletonMopidyPlaybackManager.getImagesForTracks([trackInfo]);
        return {
            trackInfo,
            trackImage,
        };
    }

    async function dispatchPlay() {
        const currentlyPlayingTrack = await updateCurrentlyPlayingTrackInfo();
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
                await updateCurrentlyPlayingTrackInfo();
                await SingletonMopidyPlaybackManager.getListOfPlaylists();
                await performDefaultSearch('Mac Miller');
                if (await SingletonMopidyPlaybackManager.getPlaybackState() === 'playing') {
                    await dispatchPlay();
                }
                updateIsConnected(true);
            },
            offline: async () => {
                updateIsConnected(false);
            },
            trackPlaybackStarted: async () => {
                await dispatchPlay()
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
        mopidy.on('event:trackPlaybackStarted', getTrackPlaybackStartedHandler())
        fetch();
    }, [searchResults]);

    const getTrackPlaybackStartedHandler = () => {
        return async (newTrack) => {
            searchResults.forEach((track, index) => {
                if (track.uri === newTrack.tl_track.track.uri) {
                    updateCurrentlyPlayingTrack(track);
                }
            })
        }
    }

    const performDefaultSearch = async (searchTerm) => {
        const result = await SingletonMopidyPlaybackManager.search('artist', searchTerm);
        const allTracks = result[0].tracks;
        updateSearchResults(allTracks);
    }

    const playSongAtIndex = async (index) => {
        const track = searchResults[index];
        await SingletonMopidyPlaybackManager.clearAllAndPlay(track);
        updateCurrentlyPlayingTrack(track);
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
            <PlaybackControls
                currentlyPlayingTrack={currentlyPlayingTrack}
            />
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