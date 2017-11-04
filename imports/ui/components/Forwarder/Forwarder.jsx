import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import Loading from '../Loading/Loading';

import ShortLinks from '../../../api/ShortLinks/ShortLinks';

const redirect = (findLink) => {
  Meteor.call('link.addCount', { linkId: findLink._id }, (error, result) => {
    if (error) {
      // failure
    }
    if (result) {
      // success
    }
  });
  window.location = findLink.url;
};

const Forwarder = ({ url, findLink }) => {
  let timeOut = false;
  Meteor.setTimeout(() => { timeOut = true; }, 2000);
  const noValidURL = (timeOut && !url) ? 'Sorry, no valid URL found' : <Loading />;
  return (
    (!url) ?
      <div className="forwarding">
        {noValidURL}
      </div>
      :
      <div className="forwarding">
        {redirect(findLink)}
      </div>
  );
};

Forwarder.defaultProps = {
  url: undefined,
};

Forwarder.propTypes = {
  url: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  findLink: PropTypes.object
};

export default createContainer(({ match }) => {
  const { shortLink }  = match.params;
  const subscription = Meteor.subscribe('shortLinks.view', shortLink);
  const loading = !subscription.ready();
  const findLink = ShortLinks.findOne({ shortLink });
  const url = (!loading && findLink) ? findLink.url : undefined;

  return {
    url,
    findLink,
  };
}, Forwarder);
