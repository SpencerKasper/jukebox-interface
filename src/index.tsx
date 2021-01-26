import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux';
import currentPlaybackTimeStore from "./redux/stores/currentPlaybackTime.store";

ReactDOM.render(
    <Provider store={currentPlaybackTimeStore}>
        <App/>
    </Provider>,
    document.getElementById("root")
);