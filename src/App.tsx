import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './static/scss/App.scss';
import {JukeboxWebInterface} from "./JukeboxWebInterface";
import {SingletonMopidyPlaybackManager} from "./SingletonMopidyPlaybackManager";

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path='/'>
                    <JukeboxWebInterface/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
