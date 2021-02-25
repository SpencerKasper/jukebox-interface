import React from "react";
import {TrackSearchView} from "../views/TrackSearchView";
import {ConnectingToPiView} from "../views/ConnectingToPiView";
import {CurrentlyPlayingToolbar} from "../components/CurrentlyPlayingToolbar";

export function JukeboxHomePage({isConnected}) {

    return <div className={'jukebox-web-interface page-with-toolbar'}>
        <CurrentlyPlayingToolbar/>
        {isConnected ?
            <TrackSearchView/> :
            <ConnectingToPiView/>}
    </div>;
}