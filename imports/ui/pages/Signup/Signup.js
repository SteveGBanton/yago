import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import OAuthLoginButtons from '../../components/OAuthLoginButtons/OAuthLoginButtons';
import InputHint from '../../components/InputHint/InputHint';
import AccountPageFooter from '../../components/AccountPageFooter/AccountPageFooter';
import validate from '../../../modules/validate';

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
  }

  componentWillMount() {
    const formErrors = {
      firstName: "",
      lastName: "",
      orgName: "",
      password: "",
      emailAddress: "",
    }

    this.setState({formErrors})
  }

  createUsername() {

  }

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
        password: "At least 12 characters required, and at least one uppercase letter and one number",
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
      let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{9,}$/;
      return (pass.length >= 12) && re.test(pass)
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

    // Check for empty object. If empty, submit form.
    (Object.keys(formErrors).length === 0 && formErrors.constructor === Object)
    ? this.handleSubmit()
    : this.setState({formErrors})

  }

  handleSubmit() {
    
    const { history } = this.props;

    Accounts.createUser({
      email: this.emailAddress.input.value,
      password: this.password.input.value,
      orgName: this.orgName.input.value,
      profile: {
        name: {
          first: this.firstName.input.value,
          last: this.lastName.input.value,
        },
      },
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
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
          ref={input => (this.orgName = input)}
          errorText={this.state.formErrors.orgName}
        />

        <div className="username-preview">

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

        <p>Password must be 9 characters or longer,<br/> with at least one number and one uppecase letter.</p>

        <RaisedButton type="submit" onClick={this.customValidator}>Sign Up</RaisedButton>

        <p>Already have an account? <Link to="/login">Log In</Link>.</p>

        </form>
    </div>);
  }
}

Signup.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Signup;



/**

<div className="Signup">
<Row>
  <Col xs={12} sm={6} md={5} lg={4}>
    <h4 className="page-header">Sign Up</h4>
    <Row>
      <Col xs={12}>
        <OAuthLoginButtons
          services={['facebook', 'google']}
        />
      </Col>
    </Row>
    <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
      <Row>
        <Col xs={6}>
          <FormGroup>
            <ControlLabel>First Name</ControlLabel>
            <input
              type="text"
              name="firstName"
              ref={firstName => (this.firstName = firstName)}
              className="form-control"
            />
          </FormGroup>
        </Col>
        <Col xs={6}>
          <FormGroup>
            <ControlLabel>Last Name</ControlLabel>
            <input
              type="text"
              name="lastName"
              ref={lastName => (this.lastName = lastName)}
              className="form-control"
            />
          </FormGroup>
        </Col>
      </Row>
      <FormGroup>
        <ControlLabel>Email Address</ControlLabel>
        <input
          type="email"
          name="emailAddress"
          ref={emailAddress => (this.emailAddress = emailAddress)}
          className="form-control"
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Password</ControlLabel>
        <input
          type="password"
          name="password"
          ref={password => (this.password = password)}
          className="form-control"
        />
        <InputHint>Use at least six characters.</InputHint>
      </FormGroup>
      <Button type="submit" bsStyle="success">Sign Up</Button>
      <AccountPageFooter>
        <p>Already have an account? <Link to="/login">Log In</Link>.</p>
      </AccountPageFooter>
    </form>
  </Col>
</Row>
</div>


<IconButton tooltip="Your Organization Id" touch tooltipPosition="bottom-right">
  <FontIcon className="material-icons">settings</FontIcon>
</IconButton><br/>


componentDidMount() {
  const component = this;

  validate(component.form, {
    rules: {
      firstName: {
        required: true,
      },
      lastName: {
        required: true,
      },
      emailAddress: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        minlength: 6,
      },
    },
    messages: {
      firstName: {
        required: 'What\'s your first name?',
      },
      lastName: {
        required: 'What\'s your last name?',
      },
      emailAddress: {
        required: 'Need an email address here.',
        email: 'Is this email address correct?',
      },
      password: {
        required: 'Need a password here.',
        minlength: 'Please use at least six characters.',
      },
    },
    submitHandler() { component.handleSubmit(); },
  });
}

*/
