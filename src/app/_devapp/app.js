'use strict';
import Map from 'core-js/es/map';
import Set from 'core-js/es/set';
import "babel-polyfill";
import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import { BrowserRouter , Switch, Route } from 'react-router-dom';
import { asyncComponent } from 'react-async-component';
import App from './component/App';

/* globals __webpack_public_path__ */
__webpack_public_path__ = `${window.STATIC_URL}/app/assets/bundle/`;

render((
      <App />
    ), document.getElementById('app'));