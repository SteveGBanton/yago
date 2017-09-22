import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Link } from 'react-router-dom';

export default class Download extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
  }

  componentWillMount() {
    Meteor.call('uploads.download', { uploadId: this.props.match.params.fileId }, (err, res) => {
      if (err) {
        this.setState({
          error: true,
        })
      } else {
        window.location = res;
      }
    });
  }

  render() {
    return (
      <div className="dashboard">
        <div className="inner-route">
          {(this.state.error !== true)
            ? (<h1>File Downloading...</h1>)
            : (<div><h1>Sorry,</h1><h2>you are not authorized to view this file.</h2></div>)
          }
        </div>
      </div>
    );
  }
}

Download.propTypes = {
  authenticated: PropTypes.bool,
};
