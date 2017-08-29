/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
//import validate from '../../../modules/validate';
import RaisedButton from 'material-ui/RaisedButton';

class DocumentEditor extends React.Component {
  componentDidMount() {
    const component = this;
  }

  handleSubmit() {
    const { history } = this.props;
    const existingDocument = this.props.doc && this.props.doc._id;
    const methodToCall = existingDocument ? 'documents.update' : 'documents.insert';
    const doc = {
      title: this.title.value.trim(),
      body: this.body.value.trim(),
    };

    if (existingDocument) doc._id = existingDocument;

    Meteor.call(methodToCall, doc, (error, documentId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingDocument ? 'Document updated!' : 'Document added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/documents/${documentId}`);
      }
    });
  }

  render() {
    const { doc } = this.props;
    return (
      <div>
        <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
          <RaisedButton type="submit">
            Add New
          </RaisedButton>
        </form>
      </div>
    );
  }
}

DocumentEditor.defaultProps = {
  doc: { title: '', body: '' },
};

DocumentEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default DocumentEditor;


/*
<FormGroup>
  <ControlLabel>Title</ControlLabel>
  <input
    type="text"
    className="form-control"
    name="title"
    ref={title => (this.title = title)}
    defaultValue={doc && doc.title}
    placeholder="Oh, The Places You'll Go!"
  />
</FormGroup>
<FormGroup>
  <ControlLabel>Body</ControlLabel>
  <textarea
    className="form-control"
    name="body"
    ref={body => (this.body = body)}
    defaultValue={doc && doc.body}
    placeholder="Congratulations! Today is your day. You're off to Great Places! You're off and away!"
  />
</FormGroup>
<Button type="submit" bsStyle="success">
  {doc && doc._id ? 'Save Changes' : 'Add Document'}
</Button>

// validate(component.form, {
//   rules: {
//     title: {
//       required: true,
//     },
//     body: {
//       required: true,
//     },
//   },
//   messages: {
//     title: {
//       required: 'Need a title in here, Seuss.',
//     },
//     body: {
//       required: 'This thneeds a body, please.',
//     },
//   },
//   submitHandler() { component.handleSubmit(); },
// });

*/
