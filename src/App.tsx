import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './static/scss/App.scss';
import {JukeboxWebInterface} from "./JukeboxWebInterface";
import AmbientModeSetUpPage from "./pages/AmbientModeSetUpPage";

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path='/'>
                    <JukeboxWebInterface/>
                </Route>
                <Route path='/ambientSetUp'>
                    <AmbientModeSetUpPage />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
