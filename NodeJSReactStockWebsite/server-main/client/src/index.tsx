import React from 'react';
import ReactDOM from 'react-dom';
import "./index.scss";
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import TickerPage from './pages/TickerPage';
import WatchlistPage from './pages/WatchlistPage';
import PortfolioPage from './pages/PortfolioPage';
import InfoDisplayPage from './pages/InfoDisplayPage';
import HomePage from './pages/HomePage';
import {Provider} from "react-redux";
import store from "./store";
import Footer from "./Footer";

ReactDOM.render(
    <Provider store={store}>
  <React.StrictMode>

    <BrowserRouter>
      <App/>
      <Switch>
        <Route path={"/"} exact><Redirect to={"/search/home"} /></Route>
        <Route path={"/search/home"} exact ><HomePage/></Route>
        <Route path={"/search/:tickerValue"}><InfoDisplayPage /></Route>
        <Route path={"/watchlist"} exact><WatchlistPage /></Route>
        <Route path={"/portfolio"} exact><PortfolioPage /></Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode></Provider>,
  document.getElementById('root')
);

reportWebVitals();
