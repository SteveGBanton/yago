import React from 'react';
import PropTypes from 'prop-types';

import FontIcon from 'material-ui/FontIcon';
import RemoveCircle from 'material-ui/svg-icons/content/remove-circle';
import Chip from 'material-ui/Chip';
import RaisedButton from 'material-ui/RaisedButton';

export default class EditSchemaFormDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {

  }

  render() {
    return (

    );
  }
}

EditSchemaFormDialog.defaultProps = {
  form: {},
};

EditSchemaFormDialog.propTypes = {
  form: PropTypes.object,
};
