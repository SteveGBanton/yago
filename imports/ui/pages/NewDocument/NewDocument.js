import React from 'react';
import PropTypes from 'prop-types';
import DocumentEditor from '../../components/DocumentEditor/DocumentEditor';
import AppBar from 'material-ui/AppBar'

const NewDocument = ({ history }) => (
  <div className="NewDocument">
    <AppBar
      className="page-top-bar"
      style={{backgroundColor: '#0277BD', zIndex: '900'}}
      title="Create New Document"
      showMenuIconButton={false}
    />
    <DocumentEditor history={history} />
  </div>
);

NewDocument.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewDocument;
