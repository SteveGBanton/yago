import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import { debounce, kebabCase } from 'lodash'

import OAuthLoginButtons from '../../components/OAuthLoginButtons/OAuthLoginButtons';
import InputHint from '../../components/InputHint/InputHint';
import AccountPageFooter from '../../components/AccountPageFooter/AccountPageFooter';
import validate from '../../../modules/validate';

// material-ui
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.customValidator = this.customValidator.bind(this);
    this.createUsername = this.createUsername.bind(this);

    this.state = ({
      formErrors: {
        firstName: "",
        lastName: "",
        orgName: "",
        password: "",
        emailAddress: "",
      },
      username: "",
      userNameVerified: false,
    })
  }

  createUsername = debounce(function() {
    // put into username format
    let input = kebabCase(this.orgName.input.value)
    let number = 0;

    //check if exists already
    function checkUser(potentialUserName) {
      Meteor.call('users.checkUsername', {potentialUserName}, (error, count) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          console.log(count)
          if (count > 0) {
            setUsernameFalse(potentialUserName)
            return false
          } else {
            setUsernameTrue(potentialUserName)
            return true
          }
        }
      });
    }

    var setUsernameTrue = (function(potentialUserName) {
      this.setState({ username: potentialUserName })
      this.setState({ userNameVerified: true })
      console.log(`userNameVerified = true`)
    }).bind(this)

    var setUsernameFalse = (function(potentialUserName) {
      this.setState({ username: potentialUserName })
      this.setState({ userNameVerified: false })
      console.log(`userNameVerified = false`)
      number += 1
      checkUser(`${input}-${number}`)
    }).bind(this)

    checkUser(input)

  }, 400)

  customValidator(input1, rules1, messages1) {

    const input = {
      emailAddress: this.emailAddress.input.value,
      password: this.password.input.value,
      orgName: this.orgName.input.value,
      firstName: this.firstName.input.value,
      lastName: this.lastName.input.value,
    }

    const rules = {
      firstName: {
        required: true,
        maxLength: 20,
      },
      lastName: {
        required: true,
        maxLength: 20,
      },
      emailAddress: {
        required: true,
        maxLength: 40,
        email: true,
      },
      orgName: {
        required: true,
        maxLength: 35,
      },
      password: {
        required: true,
        password: true,
      },
    }

    const messages = {
      firstName: {
        required: "This field is required",
      },
      lastName: {
        required: "This field is required",
      },
      emailAddress: {
        required: "This field is required",
        email: "Please enter a valid email",
      },
      orgName: {
        required: "This field is required",
      },
      password: {
        required: "This field is required",
        password: "Keep your account safe: at least 9 characters required, at least one uppercase letter and one number. Special characters allowed: $%@#£€*?&",
      },
    }

    function valMaxLength(input, length) {
      return input.length <= Number(length);
    };

    function valMinLength(input, length) {
      return input.length >= Number(length);
    };

    function valEmail(email) {
      let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    };

    function valPassword(pass) {
      let re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{9,}$/;

      return re.test(pass)
    }

    let formErrors = {};

    Object.keys(rules).forEach((field) => {
      Object.keys(rules[field]).forEach((subrule) => {
        switch (subrule) {
          case 'required':
            if (!input[field]) {
              formErrors[field] = messages[field]['required'];
            }
            break;
          case 'minLength':
            if (input[field]) {
              (!valMinLength(input[field], rules[field][subrule]))
              ? formErrors[field] = messages[field]['minLength']
              : null;
            }
            break;
          case 'maxLength':
            if (input[field]) {
              (!valMaxLength(input[field], rules[field][subrule]))
              ? formErrors[field] = messages[field]['maxlength']
              : null;
            }
            break;
          case 'email':
            if (input[field]) {
              (!valEmail(input[field]))
              ? formErrors[field] = messages[field]['email']
              : null;
            }
            break;
          case 'password':
            if (input[field]) {
              (!valPassword(input[field]))
              ? formErrors[field] = messages[field]['password']
              : null;
            }
            break;
          default:
            break;
        }
      })
    });

    if (this.state.userNameVerified === false) {
      formErrors.orgName = 'Sorry, username is taken'
    }

    // Check for empty object. If empty and username is verified, submit form.
    if (
      Object.keys(formErrors).length === 0
      && formErrors.constructor === Object
      && this.state.userNameVerified === true
    ) {
      this.handleSubmit()
    } else {
      this.setState({formErrors})
    }

  }

  handleSubmit() {

    const { history } = this.props;

    const newAdmin = {
      email: this.emailAddress.input.value,
      password: this.password.input.value,
      username: this.state.username,
      profile: {
        name: {
          first: this.firstName.input.value,
          last: this.lastName.input.value,
        },
      },
    }

    Accounts.createUser({
      email: this.emailAddress.input.value,
      password: this.password.input.value,
      username: this.state.username,
      profile: {
        name: {
          first: this.firstName.input.value,
          last: this.lastName.input.value,
        },
      },
    }, (error, res) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Meteor.call('users.addAdminRole');
        Meteor.call('users.sendVerificationEmail');
        Bert.alert('Welcome!', 'success');
        history.push('/dashboard');
      }
    });

  }

  render() {
    return (
      <div className="Signup">

        <OAuthLoginButtons
          services={['facebook', 'google']}
        />

        <form onSubmit={event => event.preventDefault()}>

        <TextField
          name="orgName"
          floatingLabelText="Organization Name"
          onChange={this.createUsername}
          ref={input => (this.orgName = input)}
          errorText={this.state.formErrors.orgName}
          maxLength='22'
        />

        <div className="username-preview">
          {this.state.username}
          {(this.state.username === false) ? 'username already taken' : ''}
        </div>

        <TextField
          name="firstName"
          floatingLabelText="First Name"
          errorText=""
          ref={input => (this.firstName = input)}
          errorText={this.state.formErrors.firstName}
        /><br/>

        <TextField
          name="lastName"
          floatingLabelText="Last Name"
          ref={input => (this.lastName = input)}
          errorText=""
          errorText={this.state.formErrors.lastName}
        /><br/>

        <TextField
          name="emailAddress"
          floatingLabelText="Email Address"
          ref={input => (this.emailAddress = input)}
          errorText=""
          errorText={this.state.formErrors.emailAddress}
        /><br/>

        <TextField
          name="password"
          type="password"
          floatingLabelText="Password"
          ref={password => (this.password = password)}
          errorText=""
          errorText={this.state.formErrors.password}
        />

        <div>

        <RaisedButton type="submit" onClick={this.customValidator}>Sign Up</RaisedButton>

        </div>

        <p>Already have an account? <Link to="/login">Log In</Link>.</p>

        </form>
    </div>);
  }
}

Signup.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Signup;
