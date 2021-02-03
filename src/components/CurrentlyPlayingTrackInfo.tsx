import React from 'react';
import {useSelector} from 'react-redux';

const CurrentlyPlayingTrackInfo = () => {
    const currentlyPlayingTrack = useSelector((state) => state.playback.currentlyPlayingTrack);
    const {trackImage, trackInfo} = currentlyPlayingTrack;

    const currentlyPlayingSongImageUrl = trackImage && trackImage[trackInfo.uri] ?
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