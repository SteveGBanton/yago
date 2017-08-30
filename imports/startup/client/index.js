import React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import App from '../../ui/App/App.jsx';

import '../../ui/stylesheets/app.scss';

Bert.defaults = {
  hideDelay: 3500,
  // Accepts: a number in milliseconds.
  style: 'growl-bottom-right',
  // Accepts: fixed-top, fixed-bottom, growl-top-left,   growl-top-right,
  // growl-bottom-left, growl-bottom-right.
  type: 'default'
  // Accepts: default, success, info, warning, danger.
};

Meteor.startup(() => render(<App />, document.getElementById('react-root')));
