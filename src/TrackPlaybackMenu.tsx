import {Menu, MenuItem} from "@material-ui/core";
import React from "react";

export function TrackPlaybackMenu(props: { anchorEl: HTMLImageElement, onClose: () => void, onClick: () => Promise<void>, onClick1: () => Promise<void> }) {
    return <Menu
        anchorEl={props.anchorEl}
        keepMounted
        open={Boolean(props.anchorEl)}
        onClose={props.onClose}
    >
        <MenuItem onClick={props.onClick}>Play</MenuItem>
        <MenuItem onClick={props.onClick1}>Add to Queue</MenuItem>
    </Menu>;
}