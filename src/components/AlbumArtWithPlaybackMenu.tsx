import React from 'react';
import {SingletonMopidyPlaybackManager} from "../SingletonMopidyPlaybackManager";
import jukeboxReduxStore from "../redux/jukebox-redux-store";

const AlbumArtWithPlaybackMenu = ({track, searchResultImages, index}) => {
    const handleSongClick = (event: React.MouseEvent<HTMLImageElement>, index: number) => {
        jukeboxReduxStore.dispatch({
            type: 'searchResults/actOnSearchResult',
            payload: {selectedTrackDivToAnchorOn: event.currentTarget, currentlyViewingIndex: index}
        })
    };

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
};

export default AlbumArtWithPlaybackMenu;