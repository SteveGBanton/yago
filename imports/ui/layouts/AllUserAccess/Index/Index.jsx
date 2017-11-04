import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import LinkAdder from '../../../components/LinkAdder/LinkAdder'

import './Index.scss';

const Index = ({ history }) => (
  <div className="index">
    <h2>Welcome to Yago, a simple URL shortener service.</h2>
    <p style={{ fontSize: 13, marginBottom: 120 }}>Please enter a link or <a href="/login">login</a> to get started.</p>
    <LinkAdder history={history} />
  </div>
);

Index.propTypes = {
  history: PropTypes.shape({}).isRequired,
};

export default Index;
