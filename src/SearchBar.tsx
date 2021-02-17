import React, {useState} from "react";
import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";
import {Button, TextField, Select, MenuItem} from "@material-ui/core";
import jukeboxReduxStore from "./redux/jukebox-redux-store";

export function SearchBar() {
    const SEARCH_TYPES = [
        {value: 'track_name', name: 'Song Title'},
        {value: 'artist', name: 'Artist'},
        {value: 'album', name: 'Album'},
        {value: 'genre', name: 'Genre'},
    ];

    const [selectedSearchType, updateSelectedSearchType] = useState('track_name');
    const [searchValue, updateSearchValue] = useState('');

    const getSelectedSearchTypeName = () => {
        return SEARCH_TYPES.filter(type => type.value === selectedSearchType)[0].name;
    }

    const search = async () => {
        const result = await SingletonMopidyPlaybackManager.search(selectedSearchType, searchValue);
        const allTracks = result[0].tracks;
        const searchResultImages = await SingletonMopidyPlaybackManager.getImagesForTracks(allTracks);
        jukeboxReduxStore.dispatch({
            type: 'searchResults/setSearchResults',
            payload: {tracks: allTracks, images: searchResultImages}
        });
    }

    return <div className={"search-bar-container"}>
        <div className={'search-type-container'}>
            <Select value={selectedSearchType} onChange={(event) => updateSelectedSearchType(event.target.value as string)}>
                {SEARCH_TYPES.map(type =>
                    <MenuItem value={type.value}>
                        {type.name}
                    </MenuItem>
                )}
            </Select>
        </div>
        <div>
            <TextField value={searchValue} onChange={(event) => updateSearchValue(event.target.value)}
                       className={"search-bar"} label={`Search by ${getSelectedSearchTypeName()}`} onKeyDown={async (event) => {
                const ENTER_KEY_CODE = 13;
                if (event.keyCode === ENTER_KEY_CODE) {
                    await search();
                }
            }}/>
        </div>
    </div>;
}