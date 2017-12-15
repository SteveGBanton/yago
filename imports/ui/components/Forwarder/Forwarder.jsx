import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import Loading from '../Loading/Loading';

import ShortLinks from '../../../api/ShortLinks/ShortLinks';

import './Forwarder.scss';

const redirect = function redirect(url) {
  window.location = url;
};

export class Forwarder extends React.Component {

  constructor(props) {
    super(props);
    this.addCount = this.addCount.bind(this);
    this.state = {
      timeOut: false,
      recorded: 0,
    };
  }

  componentDidMount() {
    Meteor.setTimeout(() => {
      this.setState({
        timeOut: true,
      });
    }, 2000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.findLink && nextProps.url) {
      this.setState({
        recorded: this.state.recorded + 1,
      }, () => {
        this.addCount(nextProps.findLink);
      });
    }
  }

  addCount(findLink) {
    // check for this.state.recorded to equal less than 2 - ensures clicks.insert is only called once
    if (this.state.recorded < 2) {
      Meteor.call('clicks.insert', {
        linkId: findLink._id,
      }, (error) => {
        if (error) {
          // Not inserted into DB for some reason. Log to error file on server.
          console.log(error.reason);
        }
      });
    }
    console.log('redirect');
    redirect(findLink.url);
  }

  render() {
    const { url, findLink } = this.props;
    const noValidURL = (this.state.timeOut && !url) ? 'Sorry, no valid URL found' : <Loading />;

    return (
      (!url) ?
        <div className="forwarding">
          {noValidURL}
        </div>
        :
        <div className="forwarding">
          <Loading />
        </div>
    );
  }
};

Forwarder.defaultProps = {
  url: undefined,
  findLink: undefined,
};

Forwarder.propTypes = {
  url: PropTypes.string,
  findLink: PropTypes.shape({}),
};

export default createContainer(({ match }) => {
  const { shortLink } = match.params;
  const subscription = Meteor.subscribe('shortLinks.view', shortLink);
  const loading = !subscription.ready();
  const findLink = ShortLinks.findOne({ shortLink });
  const url = (!loading && findLink) ? findLink.url : undefined;

  return {
    url,
    findLink,
  };
}, Forwarder);
