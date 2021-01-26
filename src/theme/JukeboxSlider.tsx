import {Slider, withStyles} from "@material-ui/core";
import React from "react";

type Props = {
    defaultValue: any,
    min: any,
    step: number,
    max: any,
    onMouseDown?: () => void,
    onMouseUp?: () => void, onChangeCommitted?: (event, newValue) => Promise<void>, valueLabelFormat: (value) => string
}

export function JukeboxSlider(props: Props) {
    const StyledSlider = withStyles({
        root: {
            color: 'black',
            height: 8,
            display: 'flex',
            alignItems: 'center',
        },
        valueLabel: {
            borderRadius: 'unset'
        },
        thumb: {
            marginTop: '1px',
        }
    })(Slider);

    return <div className={"slider"}>
        <StyledSlider
            defaultValue={props.defaultValue}
            step={props.step}
            min={props.min || 0}
            max={props.max}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            onChangeCommitted={props.onChangeCommitted}
            valueLabelFormat={props.valueLabelFormat}
            valueLabelDisplay={"auto"}
        />
    </div>;
}