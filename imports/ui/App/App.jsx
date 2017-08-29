/* eslint-disable jsx-a11y/no-href*/

import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Bert } from 'meteor/themeteorchef:bert';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

// Dashboard layouts
import AllUserAccess from '../layouts/AllUserAccess/AllUserAccess.jsx';
import ClientAdmin from '../layouts/ClientAdmin/ClientAdmin.jsx';
import Public from '../layouts/Public/Public.jsx';
import SuperAdmin from '../layouts/SuperAdmin/SuperAdmin.jsx';
import UserAdmin from '../layouts/UserAdmin/UserAdmin.jsx';

// SuperAdmin pages

// ClientAdmin pages
import Documents from '../layouts/ClientAdmin/Documents/Documents.jsx';
import NewDocument from '../layouts/ClientAdmin/Documents/NewDocument/NewDocument.jsx';
import ViewDocument from '../layouts/ClientAdmin/Documents/ViewDocument/ViewDocument.jsx';
import EditDocument from '../layouts/ClientAdmin/Documents/EditDocument/EditDocument.jsx';
import Profile from '../layouts/ClientAdmin/Profile/Profile.jsx';

// UserAdmin pages
import UserDashboard from '../layouts/UserAdmin/UserDashboard/UserDashboard.jsx';

// Public Only pages
import Signup from '../layouts/Public/Signup/Signup.jsx';
import Login from '../layouts/Public/Login/Login.jsx';
import Logout from '../layouts/Public/Logout/Logout.jsx';

// All users pages
import Index from '../layouts/AllUserAccess/Index/Index.jsx';
import NotFound from '../layouts/AllUserAccess/NotFound/NotFound.jsx';
import Terms from '../layouts/AllUserAccess/Terms/Terms.jsx';
import Privacy from '../layouts/AllUserAccess/Privacy/Privacy.jsx';
import RecoverPassword from '../layouts/AllUserAccess/RecoverPassword/RecoverPassword.jsx';
import ResetPassword from '../layouts/AllUserAccess/ResetPassword/ResetPassword.jsx';
import VerifyEmail from '../layouts/AllUserAccess/VerifyEmail/VerifyEmail.jsx';

// Components
import Footer from '../components/Footer/Footer';
import Navigation from '../components/Navigation/Navigation.jsx';


import './App.scss';

const handleResendVerificationEmail = (emailAddress) => {
  Meteor.call('users.sendVerificationEmail', (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert(`Check ${emailAddress} for a verification link!`, 'success');
    }
  });
};

const App = props => (
  <Router>
    {
      (!props.loading)
      ?
        <MuiThemeProvider>
          <div className="App">
            <Navigation {...props} />
            <Switch>
              <AllUserAccess exact path="/" component={Index} {...props} />
              <ClientAdmin exact path="/:username/admin/dashboard" component={Documents} {...props} />
              <UserAdmin exact path="/:username/user/dashboard" component={UserDashboard} {...props} />
              <ClientAdmin exact path="/documents/new" component={NewDocument} {...props} />
              <ClientAdmin exact path="/documents/:_id" component={ViewDocument} {...props} />
              <ClientAdmin exact path="/documents/:_id/edit" component={EditDocument} {...props} />
              <ClientAdmin exact path="/profile" component={Profile} {...props} />

              <Public exact path="/signup" component={Signup} {...props} />
              <Public exact path="/login" component={Login} {...props} />
              <Public exact path="/logout" component={Logout} {...props} />
              <AllUserAccess name="verify-email" path="/verify-email/:token" component={VerifyEmail} />
              <AllUserAccess name="recover-password" path="/recover-password" component={RecoverPassword} />
              <AllUserAccess name="reset-password" path="/reset-password/:token" component={ResetPassword} />
              <AllUserAccess name="terms" path="/terms" component={Terms} />
              <AllUserAccess name="privacy" path="/privacy" component={Privacy} />
              <AllUserAccess component={NotFound} />
            </Switch>
          </div>
        </MuiThemeProvider>
      : ''
    }
  </Router>
);

App.defaultProps = {
  userId: '',
  emailAddress: '',
};

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  emailAddress: PropTypes.string,
  emailVerified: PropTypes.bool.isRequired,
};

const getUserName = name => ({
  string: name,
  object: `${name.first} ${name.last}`,
}[typeof name]);

export default createContainer(() => {
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  const loading = !Roles.subscription.ready();
  const name = user && user.profile && user.profile.name && getUserName(user.profile.name);
  const emailAddress = user && user.emails && user.emails[0].address;

  return {
    loading,
    loggingIn,
    authenticated: !loggingIn && !!userId,
    name: name || emailAddress,
    roles: !loading && Roles.getRolesForUser(userId),
    userId,
    emailAddress,
    emailVerified: user && user.emails ? user && user.emails && user.emails[0].verified : true,
  };
}, App);


/*
const App = props => (
  <Router>
    {!props.loading ? <div className="App">
      {props.userId && !props.emailVerified ? <Alert className="verify-email text-center"><p>Hey friend! Can you <strong>verify your email address</strong> ({props.emailAddress}) for us? <Button bsStyle="link" onClick={() => handleResendVerificationEmail(props.emailAddress)} href="#">Re-send verification email</Button></p></Alert> : ''}
      <Navigation {...props} />
      <Grid>
        <Switch>
          <Route exact name="index" path="/" component={Index} />
          <Authenticated exact path="/documents" component={Documents} {...props} />
          <Authenticated exact path="/documents/new" component={NewDocument} {...props} />
          <Authenticated exact path="/documents/:_id" component={ViewDocument} {...props} />
          <Authenticated exact path="/documents/:_id/edit" component={EditDocument} {...props} />
          <Authenticated exact path="/profile" component={Profile} {...props} />
          <Public path="/signup" component={Signup} {...props} />
          <Public path="/login" component={Login} {...props} />
          <Public path="/logout" component={Logout} {...props} />
          <Route name="verify-email" path="/verify-email/:token" component={VerifyEmail} />
          <Route name="recover-password" path="/recover-password" component={RecoverPassword} />
          <Route name="reset-password" path="/reset-password/:token" component={ResetPassword} />
          <Route name="terms" path="/terms" component={Terms} />
          <Route name="privacy" path="/privacy" component={Privacy} />
          <Route name="examplePage" path="/example-page" component={ExamplePage} />
          <Route component={NotFound} />
        </Switch>
      </Grid>
      <Footer />
    </div> : ''}
  </Router>
);

*/
