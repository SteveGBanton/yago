import React from 'react';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
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

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

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

  customValidator(input, rules1, messages1) {

    let validated = false;

    const inputExample = {
      firstName: 'firstname feagea',
      lastName: 'lastnamegegeafea',
      emailAddress: 'email@geafeage.com',
      orgName: 'orgname geageage',
      password: 'passwordtesthere',
    };

    const rules = {
      firstName: {
        required: true,
        maxlength: 20,
      },
      lastName: {
        required: true,
        maxlength: 20,
      },
      emailAddress: {
        required: true,
        maxlength: 40,
        email: true,
      },
      orgName: {
        required: true,
        maxlength: 35,
      },
      password: {
        required: true,
        minlength: 12,
        maxlength: 30,
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
      },
      orgName: {
        required: "This field is required",
      },
      password: {
        required: "This field is required",
        minLength: "At least 12 characters required",
      },
    }

    console.log(rules.keys())

    function valMaxLength(input, length) {
      return input.length <= Number(length);
    };

    function valMinLength(input, length) {
      return input.length >= Number(length);
    };

    function valRequired(input) {
      return input !== ''
    };

    function validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    };

    const formErrors = {};

    return (validated === true) ? null : formErrors

    //Builds a JSON list of all the form errors, then delivered via setState dynamically.

  }

  handleSubmit() {

    const formErrors = {
      firstName: "Test Error1",
      lastName: "Test Error1",
      orgName: "Test Error1",
      password: "Test Error1",
      emailAddress: "Test Error1",
    }

    this.setState({formErrors})

    const { history } = this.props;

    console.log(this.orgName.input.value)
    console.log(this.emailAddress.input.value)
    console.log(this.lastName.input.value)
    console.log(this.firstName.input.value)
    console.log(this.password.input.value)

    if (
      !this.emailAddress.input.value
      || !this.password.input.value
      || !this.firstName.input.value
      || !this.lastName.input.value
      || !this.orgName.input.value
    ) {
      console.log('all values required')
      return
    }

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
        history.push('/documents');
      }
    });
  }

  render() {
    return (
      <div className="Signup">

        <OAuthLoginButtons
          services={['facebook', 'google']}
        />

        <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>

        <TextField
          name="orgName"
          floatingLabelText="Organization Name"
          ref={input => (this.orgName = input)}
          errorText={this.state.formErrors.orgName}
        />

        <div className="username-preview">
          <IconButton tooltip="This will be used as your username" touch tooltipPosition="bottom-right">
            <FontIcon className="material-icons" >settings</FontIcon>
          </IconButton>
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
        /><br/>
        <div>At least 10 characters required</div>

        <p>Already have an account? <Link to="/login">Log In</Link>.</p>

          <Button onClick={this.handleSubmit}>Sign Up</Button>

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




*/



// componentDidMount() {
//   const component = this;
//
//   validate(component.form, {
//     rules: {
//       firstName: {
//         required: true,
//       },
//       lastName: {
//         required: true,
//       },
//       emailAddress: {
//         required: true,
//         email: true,
//       },
//       password: {
//         required: true,
//         minlength: 6,
//       },
//     },
//     messages: {
//       firstName: {
//         required: 'What\'s your first name?',
//       },
//       lastName: {
//         required: 'What\'s your last name?',
//       },
//       emailAddress: {
//         required: 'Need an email address here.',
//         email: 'Is this email address correct?',
//       },
//       password: {
//         required: 'Need a password here.',
//         minlength: 'Please use at least six characters.',
//       },
//     },
//     submitHandler() { component.handleSubmit(); },
//   });
// }
