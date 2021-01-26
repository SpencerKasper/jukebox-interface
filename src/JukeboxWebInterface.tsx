import React, {useEffect, useState} from "react";
import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";
import {TrackPlaybackMenu} from "./TrackPlaybackMenu";
import PlaybackControls from "./PlaybackControls";
import {SearchBar} from "./SearchBar";
import {VolumeControls} from "./VolumeControls";
import currentPlaybackTimeStore from "./redux/stores/currentPlaybackTime.store";

const mopidy = SingletonMopidyPlaybackManager.getMopidyInstance();

export function JukeboxWebInterface() {
    const [searchResults, updateSearchResults] = useState([]);
    const [currentlyPlayingTrack, updateCurrentlyPlayingTrack] = useState(null);
    const [currentlyPlayingTrackImage, updateCurrentlyPlayingTrackImage] = useState({});
    const [searchResultImages, updateSearchResultTrackImages] = useState({});
    const [currentlyViewingIndex, updateCurrentlyViewingIndex] = useState(null);

    async function updateCurrentlyPlayingTrackInfo() {
        const currentlyPlayingTrack = await SingletonMopidyPlaybackManager.getCurrentlyPlayingTrack();
        updateCurrentlyPlayingTrack(currentlyPlayingTrack);
        await SingletonMopidyPlaybackManager.getImagesForTracks([currentlyPlayingTrack], (images) => {
            updateCurrentlyPlayingTrackImage(images);
        });
    }

    async function dispatchCurrentPlaybackTime() {
        const currentPlaybackTime = await SingletonMopidyPlaybackManager.getCurrentPlaybackTime();

        currentPlaybackTimeStore.dispatch({
            type: 'playback/play',
            payload: {playbackTime: currentPlaybackTime}
        })
    }

    useEffect(() => {
        SingletonMopidyPlaybackManager.startMopidy({
            online: async () => {
                await updateCurrentlyPlayingTrackInfo();
                await SingletonMopidyPlaybackManager.getListOfPlaylists();
                await performDefaultSearch('Mac Miller');
                if (await SingletonMopidyPlaybackManager.getPlaybackState() === 'playing') {
                    await dispatchCurrentPlaybackTime();
                }
            },
            trackPlaybackStarted: async () => {
                await updateCurrentlyPlayingTrackInfo();
                await dispatchCurrentPlaybackTime()
            },
            trackPlaybackEnded: async () => {
                currentPlaybackTimeStore.dispatch({type: 'playback/stop'});
            },
            playbackStateChanged: async ({old_state, new_state}) => {
                if (new_state !== 'playing') {
                    // clearInterval(interval)
                }
            }
        })
        // return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        mopidy.on('event:trackPlaybackStarted', getTrackPlaybackStartedHandler())
        SingletonMopidyPlaybackManager.getImagesForTracks(searchResults, updateSearchResultTrackImages);
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
        console.error('playing song at index: ', index);
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

    const currentlyPlayingSongImageUrl = currentlyPlayingTrack && currentlyPlayingTrackImage && currentlyPlayingTrackImage[currentlyPlayingTrack.uri] ?
        currentlyPlayingTrackImage[currentlyPlayingTrack.uri][0].uri :
        '';

    return <div className={'jukebox-web-interface'}>
        <div className={'currently-playing-toolbar'}>
            <div className={'album-art-with-song-info'}>
                {currentlyPlayingTrack && currentlyPlayingSongImageUrl &&
                <div className={'currently-playing-album-art-container'}>
                    <img
                        src={currentlyPlayingSongImageUrl}
                        alt={"currently playing"}
                        width={64}
                        height={64}/>
                </div>
                }
                <div>
                    <div>
                        {currentlyPlayingTrack ? currentlyPlayingTrack.name : "-"}
                    </div>
                    <div>
                        {currentlyPlayingTrack ? currentlyPlayingTrack.artists[0].name : "-"}
                    </div>
                </div>
            </div>
            <PlaybackControls
                currentlyPlayingTrack={currentlyPlayingTrack}
            />
            <VolumeControls/>
        </div>
        <SearchBar updateTracks={updateSearchResults}/>
        <div style={{textAlign: "center"}}>
            <div
                style={{display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center"}}>
                {
                    searchResults.length && searchResultImages !== {} && searchResults.map((track, index) => {
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
                    })
                }
                <TrackPlaybackMenu anchorEl={anchorEl} onClose={handlePopoverClose} onClick={() => {
                    handlePopoverClose();
                    return playSongAtIndex(currentlyViewingIndex);
                }} onClick1={() => {
                    handlePopoverClose();
                    return addSongAtIndexToQueue(currentlyViewingIndex);
                }}/>
            </div>
        </div>
    </div>;
}