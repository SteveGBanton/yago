/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Link } from 'react-router-dom';

import customFormValidator from '../../../modules/custom-form-validator';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

if (Meteor.isClient) {
  import './LinkAdder.scss';
}

const rules = {
  url: {
    required: true,
    url: true,
  },
}

const messages = {
  url: {
    required: 'Please enter a link.',
    url: 'Please enter a full URL with http(s)',
  },
}

export default class LinkAdder extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formValidate = this.formValidate.bind(this);

    this.state = ({
      formErrors: {
        url: '',
      },
      url: '',
      shortLink: '',
    })
  }

  formValidate() {
    const input = {
      url: this.url.input.value,
    }

    const formErrors = customFormValidator(input, rules, messages);

    if (!formErrors) {
      this.handleSubmit(input);
      this.setState({ formErrors: {} });
    } else {
      this.setState({ formErrors });
    }

    return;
  }

  handleSubmit(input) {
    const { history } = this.props;
    console.log('submitting')
    console.log(input)

    Meteor.call('link.insert', input, (error, res) => {
      if (error) {
        console.log('error')
        Bert.alert(error.reason, 'danger');
      } else {
        console.log('success')
        this.form.reset();
        Bert.alert('Shortlink created!', 'success');
        this.setState({
          shortLink: `http://yago.site/${res}`,
        })
      }
    });
  }

  copyText() {
    var copyTextarea = document.querySelector('.js-copytextarea');
    copyTextarea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }
  }

  render() {
    const { doc } = this.props;
    return (
      <form className="link-adder" ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>

        {(this.state.shortLink && Meteor.user() === null) ?
          <div style={{ fontSize: 10, marginBottom: 15 }}><a href="/login">Log in</a> to save your shortlinks and view clicks!</div>
          :
          ''
        }

        {(this.state.shortLink && Meteor.user() !== null) ?
          <div style={{ fontSize: 10, marginBottom: 15 }}>View all shortlinks you've created <Link to="/links">here</Link></div>
          :
          ''
        }

        {(this.state.shortLink) ?
          <TextField
            className="short-link-field"
            name="shortLink"
            style={{ fontSize: 15, width: 200, marginBottom: 50 }}
            inputStyle={{ paddingLeft: 5, marginTop: -5 }}
            value={this.state.shortLink}
          />
          :
          ''
        }

        <TextField
          name="title"
          style={{ fontSize: 20, width: 350 }}
          hintText="Add a new link"
          hintStyle={{ padding: 10 }}
          inputStyle={{ paddingLeft: 10, marginTop: -10 }}
          ref={(input) => { this.url = input; }}
        />
        <br />

        {(this.state.formErrors.url) ?
          <div style={{ color: 'red', fontSize: 10, width: '100%', marginTop: -10 }}>* {this.state.formErrors.url}</div>
          :
          ''
        }

        <RaisedButton
          type="submit"
          onClick={this.formValidate}
          style={{ margin: 35 }}
        >
          Submit
        </RaisedButton>
      </form>
    );
  }
}

LinkAdder.propTypes = {
  history: PropTypes.shape({}).isRequired,
}
