import React from 'react';
import {useSelector} from 'react-redux';
import {JukeboxReduxStore} from "../redux/jukebox-redux-store";

const CurrentlyPlayingTrackInfo = () => {
    const currentlyPlayingTrack = useSelector((state: JukeboxReduxStore) => state.playback.currentlyPlayingTrack);
    const trackImage = currentlyPlayingTrack ? currentlyPlayingTrack.trackImage : null;
    const trackInfo = currentlyPlayingTrack ? currentlyPlayingTrack.trackInfo : null;
    const currentlyPlayingSongImageUrl = trackImage && trackInfo && trackImage[trackInfo.uri] ?
        trackImage[trackInfo.uri][0].uri :
        '';

    return (
        <div className={'album-art-with-song-info'}>
            {trackImage &&
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
                    {trackInfo ? trackInfo.name : "-"}
                </div>
                <div>
                    {trackInfo ? trackInfo.artists[0].name : "-"}
                </div>
            </div>
        </div>
    )
}

export default CurrentlyPlayingTrackInfo;