import dotenv from 'dotenv';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux';
import jukeboxReduxStore from "./redux/jukebox-redux-store";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
dotenv.config();

ReactDOM.render(
    <Provider store={jukeboxReduxStore}>
        <ToastContainer />
        <App/>
    </Provider>,
    document.getElementById("root")
);
