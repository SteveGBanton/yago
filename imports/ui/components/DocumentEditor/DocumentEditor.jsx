/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import customFormValidator from '../../../modules/custom-form-validator';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const rules = {
  title: {
    required: true,
  },
  body: {
    required: true,
  },
}

const messages = {
  title: {
    required: 'Please enter a title for the Doc.',
  },
  body: {
    required: 'Please enter a body for the Doc.',
  },
}

class DocumentEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formValidate = this.formValidate.bind(this);

    this.state = ({
      formErrors: {
        title: "",
        body: "",
      },
    })
  }

  componentDidMount() {
    const component = this;
  }

  formValidate() {

    const input = {
      title: this.title.input.value,
      body: this.bodytxt.input.refs.input.value,
    }

    let formErrors = customFormValidator(input, rules, messages);

    if (!formErrors) {
      this.handleSubmit();
    } else {
      this.setState({formErrors});
    }

    return;
  }

  handleSubmit() {
    const { current } = this.props.user;
    const { history } = this.props;
    const existingDocument = this.props.doc && this.props.doc._id;
    const methodToCall = existingDocument ? 'documents.update' : 'documents.insert';
    const doc = {
      title: this.title.input.value.trim(),
      body: this.bodytxt.input.refs.input.value.trim(),
    };

    if (existingDocument) doc._id = existingDocument;

    Meteor.call(methodToCall, doc, (error, documentId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingDocument ? 'Document updated!' : 'Document added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/${current.currentOrg}/${current.currentRole}/documents/${documentId}`);
      }
    });
  }

  render() {
    const { doc } = this.props;
    return (
      <div>
        <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>

          <TextField
            name="title"
            floatingLabelText="Document Title"
            ref={input => (this.title = input)}
            errorText={this.state.formErrors.title}
            defaultValue={doc && doc.title}
          /><br/>

          <TextField
            name="body"
            style={{width: '70%'}}
            textareaStyle={{backgroundColor: '#f7f7f7'}}
            floatingLabelText="Document body"
            ref={input => (this.bodytxt = input)}
            multiLine={true}
            rows={5}
            rowsMax={10}
            defaultValue={doc && doc.body}
            errorText={this.state.formErrors.body}
          /><br/>

          <RaisedButton
            type="submit"
            onClick={this.formValidate}
            style={{margin: "35px 0 35px 0", padding: "5px 10px 5px 10px"}}
          >
            Create New Document
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
