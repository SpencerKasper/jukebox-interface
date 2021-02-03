import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux';
import jukeboxReduxStore from "./redux/jukebox-redux-store";

ReactDOM.render(
    <Provider store={jukeboxReduxStore}>
        <App/>
    </Provider>,
    document.getElementById("root")
);