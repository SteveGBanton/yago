import React from 'react';
import PropTypes from 'prop-types';

import EditSchemaForm from '../../../components/EditSchemaForm/EditSchemaForm';

const AddSchemaForm = () => (
  <div className="EditDocument">
    <h1 className="page-header">Create New Form</h1>
    <EditSchemaForm />
  </div>
)

// AddSchemaForm.propTypes = {
//   history: PropTypes.object.isRequired,
//   user: PropTypes.object.isRequired,
// };

export default AddSchemaForm;
