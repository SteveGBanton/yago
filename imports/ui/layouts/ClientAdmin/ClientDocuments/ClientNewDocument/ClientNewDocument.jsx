import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar'

import DocumentEditor from '../../../../components/DocumentEditor/DocumentEditor.jsx';

const ClientNewDocument = ({ history }) => (
  <div className="NewDocument">
    <h2>New Doc</h2>
    <DocumentEditor history={history} />
  </div>
);

NewDocument.propTypes = {
  history: PropTypes.object.isRequired,
};

export default ClientNewDocument;
