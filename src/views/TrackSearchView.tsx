import {SearchBar} from "../components/SearchBar";
import {TrackPlaybackMenu} from "../components/TrackPlaybackMenu";
import React, {useEffect} from "react";
import {useSelector} from 'react-redux';
import AlbumArtWithPlaybackMenu from "../components/AlbumArtWithPlaybackMenu";
import axios from "axios";

export function TrackSearchView() {
    const searchResultTracks = useSelector((state) => ({tracks: state.searchResults.tracks, images: state.searchResults.images}));
    return <div>
        <SearchBar />
        <div style={{textAlign: "center"}}>
            <div className={'search-result-list-container'}>
                {
                    searchResultTracks.tracks.length && searchResultTracks.images !== {} && searchResultTracks.tracks.map((track, index) => (
                        <AlbumArtWithPlaybackMenu
                            track={track}
                            searchResultImages={searchResultTracks.images}
                            index={index}
                        />
                    ))
                }
                <TrackPlaybackMenu />
            </div>
        </div>
    </div>
}