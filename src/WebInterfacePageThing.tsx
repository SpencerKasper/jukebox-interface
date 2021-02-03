import {SearchBar} from "./SearchBar";
import {TrackPlaybackMenu} from "./TrackPlaybackMenu";
import React from "react";

export function WebInterfacePageThing(props: { updateTracks: (value: (((prevState: any[]) => any[]) | any[])) => void, searchResults: any[], searchResultImages: {}, callbackfn: (track, index) => JSX.Element, anchorEl: HTMLImageElement, onClose: () => void, onClick: () => Promise<void>, onClick1: () => Promise<void> }) {
    return <div>
        <SearchBar updateTracks={props.updateTracks}/>
        <div style={{textAlign: "center"}}>
            <div
                style={{display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center"}}>
                {
                    props.searchResults.length && props.searchResultImages !== {} && props.searchResults.map(props.callbackfn)
                }
                <TrackPlaybackMenu anchorEl={props.anchorEl} onClose={props.onClose} onClick={props.onClick}
                                   onClick1={props.onClick1}/>
            </div>
        </div>
    </div>
}