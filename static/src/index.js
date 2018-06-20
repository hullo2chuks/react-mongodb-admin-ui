import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import store, { history } from './store/configureStore';
import { App } from './App';

///require('expose?$!expose?jQuery!jquery');
///require('bootstrap-webpack');

injectTapEventPlugin();

const target = document.getElementById('root');

render(
  <Provider store={store}>
      <div>
        <App />
      </div>
  </Provider>,
  target
);