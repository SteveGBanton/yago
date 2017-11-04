import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import ShortLinks from '../../../../../api/ShortLinks/ShortLinks';
import NotFound from '../../../../components/NotFound/NotFound.jsx';
import Loading from '../../../../components/Loading/Loading';

import RaisedButton from 'material-ui/RaisedButton';

import './ViewLinkStats.scss';

const handleRemove = (_id, history) => {
  Meteor.call('link.remove', { _id }, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Link deleted!', 'success');
      history.push('/links');
    }
  });
};


const renderDocument = (doc, match, history, user) => (
  (doc)
    ? (
        <div className="view-shortlink">

          <h3>{(doc && doc.shortLink) ? `https://yagosite.herokuapp.com/${doc.shortLink}` : '' }</h3>

          <h1>{ doc && doc.url }</h1>

          <h1>{ doc && doc.clicks } Click(s)</h1>

          <RaisedButton
            onClick={() => handleRemove(doc._id, history)}
            className="text-danger"
            style={{ margin: '60px 0 0 0' }}
          >
            Delete Link
          </RaisedButton>

        </div>
      )
    : <NotFound />
);

const ViewLinkStats = ({ loading, doc, match, history, user }) => (
  !loading ? renderDocument(doc, match, history, user) : <Loading />
);

ViewLinkStats.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const { shortLink } = match.params;
  const subscription = Meteor.subscribe('shortLinks.view', shortLink);
  const doc = ShortLinks.findOne({ shortLink });

  return {
    loading: !subscription.ready(),
    doc,
  };
}, ViewLinkStats);
