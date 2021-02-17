import {SearchBar} from "./SearchBar";
import {TrackPlaybackMenu} from "./TrackPlaybackMenu";
import React from "react";
import {useSelector} from 'react-redux';
import AlbumArtWithPlaybackMenu from "./components/AlbumArtWithPlaybackMenu";

export function SearchResultsPage() {
    const searchResultTracks = useSelector((state) => ({tracks: state.searchResults.tracks, images: state.searchResults.images}));
    return <div>
        <SearchBar />
        <div style={{textAlign: "center"}}>
            <div
                style={{display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center"}}>
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