import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Navigation from "./Navigation";
import Fallback from "./other/Fallback";

require('dotenv').config();

ReactDOM.render(
  <React.StrictMode>
    <React.Fragment>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <Navigation/>}/>
          {/*<Route path="/channel/:channelId" render={() => <Navigation/>}/>*/}
          {/*<Route path="/channel/:channelId/:operation" render={() => <Navigation/>}/>*/}
          <Route path="/open-ui/channel" render={() => <Fallback/>}/>
          <Route path="/openui/pages" render={() => <Fallback/>}/>
          {/*<Route path="/openui/catalog" render={() => <Fallback/>}/>*/}
          <Route path="/**" render={() => <Fallback/>}/>
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
