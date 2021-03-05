import React, {useEffect, useState} from 'react';
import Mitch from '../static/mitch.jpg';
import {SingletonMopidyPlaybackManager} from "../SingletonMopidyPlaybackManager";

const PlaylistImage = ({playlistUri}) => {
    const [top4Images, updateTop4Images] = useState([Mitch, Mitch, Mitch, Mitch]);

    useEffect(() => {
        fetch();
    }, []);

    const fetch = async () => {
        const tracksInPlaylist = await SingletonMopidyPlaybackManager.getTracksInPlaylist(playlistUri);
        const tracks = tracksInPlaylist.filter((track, index) => index < 4);
        const images = await SingletonMopidyPlaybackManager.getImagesForTracks(tracks);
        const cleanedImageUris = Object.values(images).map(imageUrisForTrack => {
            return imageUrisForTrack[0].uri;
        });
        while(cleanedImageUris.length < 4) {
            cleanedImageUris.push(Mitch);
        }
        updateTop4Images(cleanedImageUris);
    };

    return (
        <div className={'playlist-image-container'}>
            {top4Images.map(imageUri => {
                return <img className={'playlist-singular-image'} src={imageUri}/>
            })}
        </div>
    );
};

export default PlaylistImage;