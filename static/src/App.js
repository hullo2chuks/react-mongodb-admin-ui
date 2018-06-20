import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Route, Link, Switch, Redirect, HashRouter, Router } from 'react-router-dom';
import { history } from './store/configureStore';

import { DetermineAuth } from './components/DetermineAuth';
import { requireAuthentication } from './components/AuthenticatedComponent';
import { requireNoAuthentication } from './components/notAuthenticatedComponent';


import './App.css';
// Styles
// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css';
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import './scss/style.css'

// Containers
import { DefaultLayout } from './containers';
// Pages
import { Login, Page404, Page500, Register } from './views/Pages';

// import { renderRoutes } from 'react-router-config';


class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/login" name="Login Page" component={requireNoAuthentication(Login)} />
          <Route exact path="/register" name="Register Page" component={requireNoAuthentication(Register)} />
          <Route exact path="/404" name="Page 404" component={DetermineAuth(Page404)} />
          <Route exact path="/500" name="Page 500" component={DetermineAuth(Page500)} />
          <Route path="/" name="Home" component={requireAuthentication(DefaultLayout)} />
        </Switch>
      </Router>
    );
  }
}

export { App };
