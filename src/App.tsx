import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.scss';
import Mopidy from 'mopidy';
import {MenuItem, Menu} from "@material-ui/core";

const mopidy = new Mopidy({
    webSocketUrl: "ws://10.0.0.69:6680/mopidy/ws/",
});

function App() {
    const [tracks, updateTracks] = useState([]);
    const [currentSearch, updateSearch] = useState('Mac Miller');
    const [currentlyPlayingTrack, updateCurrentlyPlayingTrack] = useState(null);
    const [trackImages, updateTrackImages] = useState({});
    const [currentlyViewingIndex, updateCurrentlyViewingIndex] = useState(null);

    useEffect(() => {
        startMopidy();
    }, []);

    useEffect(() => {
        mopidy.on('event:trackPlaybackStarted', getTrackPlaybackStartedHandler())
        if (mopidy && tracks.length > 0) {
            const uris = tracks.map(track => track.uri);
            mopidy.library
                .getImages({uris})
                .then((result) => updateTrackImages(result));
        }
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

    const startMopidy = async () => {
        // @ts-ignore
        window.mopidy = mopidy;
        mopidy.on("state:online", async () => {
            const playlists = await mopidy.playlists.asList();
            console.error('playlist: ', playlists);
            const currentlyPlaying = await mopidy.playback.getCurrentTrack();
            updateCurrentlyPlayingTrack(currentlyPlaying);
            await search(currentSearch);
        });
    };

    const search = async (searchTerm) => {
        const result = await mopidy.library.search({query: {artist: [searchTerm]}});
        const allTracks = result[0].tracks;
        updateSearch(searchTerm);
        updateTracks(allTracks);
    }

    const nextSong = async () => {
        await mopidy.playback.next();
    }

    const playSongAtIndex = async (index) => {
        console.error('playing song at index: ', index);
        await mopidy.tracklist.clear();
        const track = tracks[index];
        await mopidy.tracklist.add({tracks: [track]});
        // @ts-ignore
        await mopidy.playback.play();
        updateCurrentlyPlayingTrack(track);
    }

    const addSongAtIndexToQueue = async (index) => {
        const track = tracks[index];
        await mopidy.tracklist.add({tracks: [track]});
        if (await mopidy.playback.getState() !== 'playing') {
            // @ts-ignore
            await mopidy.playback.play();
        }
    }

    const resume = async () => {
        await mopidy.playback.resume();
    }

    const pause = async () => {
        await mopidy.playback.pause();
    }

    const stop = async () => {
        await mopidy.playback.stop();
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

    return (
        <Router>
            <Switch>
                <Route exact path='/'>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: '118px',
                        padding: '16px'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            backgroundColor: 'black',
                            color: 'white',
                            width: '100%',
                            bottom: '0',
                            padding: '16px',
                            position: 'fixed',
                        }}>
                            {currentlyPlayingTrack && currentlyPlayingSongImageUrl &&
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: '0 16px'
                            }}>
                                <div style={{paddingRight: '16px'}}>
                                    <img
                                        src={currentlyPlayingSongImageUrl}
                                        alt={'currently playing'}
                                        width={64}
                                        height={64}/>
                                </div>
                                <div>
                                    <div>
                                        {currentlyPlayingTrack ? currentlyPlayingTrack.name : '-'}
                                    </div>
                                    <div>
                                        {currentlyPlayingTrack ? currentlyPlayingTrack.artists[0].name : '-'}
                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                        <div>
                            <input type={'text'} className={'search-bar'}/>
                            <button onClick={async () => {
                                // @ts-ignore
                                const searchTerm = document.getElementsByClassName('search-bar')[0].value;
                                await search(searchTerm);
                            }}>
                                Search
                            </button>
                        </div>
                        <div>
                            <button onClick={() => nextSong()}>
                                Next song.
                            </button>
                            <button onClick={() => resume()}>
                                Resume.
                            </button>
                            <button onClick={() => pause()}>
                                Pause.
                            </button>
                            <button onClick={() => stop()}>
                                Stop.
                            </button>
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <div
                                style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'}}>
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
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handlePopoverClose}
                                >
                                    <MenuItem onClick={() => {
                                        handlePopoverClose();
                                        return playSongAtIndex(currentlyViewingIndex);
                                    }}>Play</MenuItem>
                                    <MenuItem onClick={() => {
                                        handlePopoverClose();
                                        return addSongAtIndexToQueue(currentlyViewingIndex);
                                    }}>Add to Queue</MenuItem>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
