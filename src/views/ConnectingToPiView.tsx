import React from "react";
import {CircularProgress} from "@material-ui/core";

export function ConnectingToPiView() {
    return (
        <div className={'connecting-to-pi-view-container'}>
            <p>
                Please wait while we get your device set up.
            </p>
            <div>
                <CircularProgress/>
            </div>
        </div>
    );
}