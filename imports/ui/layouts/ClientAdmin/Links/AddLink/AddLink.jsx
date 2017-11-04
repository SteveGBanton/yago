import React from 'react';
import PropTypes from 'prop-types';
import LinkAdder from '../../../../components/LinkAdder/LinkAdder'

import './AddLink.scss'

const AddLink = ({ history, user }) => (
  <div className="add-link">
    <LinkAdder history={history} />
  </div>
);

AddLink.propTypes = {
  history: PropTypes.object.isRequired,
};

export default AddLink;
