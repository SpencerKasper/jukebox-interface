import React, {useEffect, useState} from "react";
import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";
import {TrackPlaybackMenu} from "./TrackPlaybackMenu";
import {PlaybackControls} from "./PlaybackControls";
import {TextField, Button} from "@material-ui/core";

const mopidy = SingletonMopidyPlaybackManager.getMopidyInstance();

export function JukeboxWebInterface() {
    const [tracks, updateTracks] = useState([]);
    const [currentSearch, updateSearch] = useState('Mac Miller');
    const [currentlyPlayingTrack, updateCurrentlyPlayingTrack] = useState(null);
    const [trackImages, updateTrackImages] = useState({});
    const [currentlyViewingIndex, updateCurrentlyViewingIndex] = useState(null);

    useEffect(() => {
        SingletonMopidyPlaybackManager.startMopidy({
            online: async () => {
                const currentlyPlayingTrack = await SingletonMopidyPlaybackManager.getCurrentlyPlayingTrack();
                updateCurrentlyPlayingTrack(currentlyPlayingTrack);
                await search(currentSearch);
            }
        })
    }, []);

    useEffect(() => {
        mopidy.on('event:trackPlaybackStarted', getTrackPlaybackStartedHandler())
        SingletonMopidyPlaybackManager.getImagesForTracks(tracks, updateTrackImages);
    }, [tracks]);

    const getTrackPlaybackStartedHandler = () => {
        return async (newTrack) => {
            tracks.forEach((track, index) => {
                if (track.uri === newTrack.tl_track.track.uri) {
                    updateCurrentlyPlayingTrack(track);
                }
            })
        }
    }

    const search = async (searchTerm) => {
        const result = await SingletonMopidyPlaybackManager.search('artist', searchTerm);
        const allTracks = result[0].tracks;
        updateSearch(searchTerm);
        updateTracks(allTracks);
    }

    const playSongAtIndex = async (index) => {
        console.error('playing song at index: ', index);
        const track = tracks[index];
        await SingletonMopidyPlaybackManager.clearAllAndPlay(track);
        updateCurrentlyPlayingTrack(track);
    }

    const addSongAtIndexToQueue = async (index) => {
        const track = tracks[index];
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

    const currentlyPlayingSongImageUrl = currentlyPlayingTrack && trackImages && trackImages[currentlyPlayingTrack.uri] ?
        trackImages[currentlyPlayingTrack.uri][0].uri :
        '';

    return <div className={'jukebox-web-interface'}>
        <div className={'currently-playing-toolbar'}>
            {currentlyPlayingTrack && currentlyPlayingSongImageUrl &&
            <div className={'toolbar-track-info-container'}>
                <div>
                    <img
                        src={currentlyPlayingSongImageUrl}
                        alt={"currently playing"}
                        width={64}
                        height={64}/>
                </div>

            </div>
            }
            <div className={'song-info-container'}>
                <div>
                    {currentlyPlayingTrack ? currentlyPlayingTrack.name : "-"}
                </div>
                <div>
                    {currentlyPlayingTrack ? currentlyPlayingTrack.artists[0].name : "-"}
                </div>
            </div>
            <PlaybackControls/>
        </div>
        <div className={'search-bar-container'}>
            <TextField className={'search-bar'} label={'Search by Artist'}/>
            <Button onClick={async () => {
                // @ts-ignore
                const searchTerm = document.getElementsByClassName('search-bar')[0].value;
                await search(searchTerm);
            }}>
                Search
            </Button>
        </div>
        <div style={{textAlign: "center"}}>
            <div
                style={{display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center"}}>
                {
                    tracks.length && trackImages !== {} && tracks.map((track, index) => {
                        const imageUrl = trackImages && trackImages[track.uri] ?
                            trackImages[track.uri][0].uri :
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