import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import AppBar from 'material-ui/AppBar'

import Documents from '../../../../../api/Documents/Documents';
import DocumentEditor from '../../../../components/DocumentEditor/DocumentEditor';
import NotFound from '../../../../components/NotFound/NotFound.jsx';

const ClientEditDocument = ({ doc, history }) => (doc ? (
  <div className="EditDocument">
    <AppBar
      className="page-top-bar"
      style={{backgroundColor: '#0277BD', zIndex: '900'}}
      title={`Editing "${doc.title}"`}
      showMenuIconButton={false}
    />
    <h4 className="page-header">{`Editing "${doc.title}"`}</h4>
    <DocumentEditor doc={doc} history={history} />
  </div>
) : <NotFound />);

ClientEditDocument.defaultProps = {
  doc: null,
};

ClientEditDocument.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const documentId = match.params._id;
  const subscription = Meteor.subscribe('documents.view', documentId);

  return {
    loading: !subscription.ready(),
    doc: Documents.findOne(documentId),
  };
}, ClientEditDocument);
