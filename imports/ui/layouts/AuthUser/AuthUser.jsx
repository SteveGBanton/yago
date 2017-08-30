import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Link } from 'react-router-dom';

import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ContentLink from 'material-ui/svg-icons/content/link';
import Divider from 'material-ui/Divider';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Download from 'material-ui/svg-icons/file/file-download';
import Delete from 'material-ui/svg-icons/action/delete';
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';

import Navigation from '../../components/Navigation/Navigation.jsx';
import Footer from '../../components/Footer/Footer.jsx';

const style = {
  paper: {
    display: 'inline-block',
    float: 'left',
    margin: '16px 32px 16px 32pxl',
  },
  rightIcon: {
    textAlign: 'center',
    lineHeight: '24px',
  },
};

/**
  Must ensure:
  user is authenticated
  userIsInRole() admin for group :username

*/

const validateUser = function validateCurrentUser(role, group) {
  console.log(group)
  if (Roles.userIsInRole(Meteor.userId(), [role], group)) {
    return true
  }
  return false
}

const multipleGroups = function multipleRoles() {
  let roles = Meteor.user().roles
  let groups = Object.keys(roles)

  if (groups.length > 1) {
    return groups
  }

  return group
}

const AuthUser = ({ loggingIn, authenticated, component, ...rest }) => (
  (authenticated)
  ?
  (
    <div className="auth-menu">
      {console.log()}
    </div>
  )
  : <Redirect to="/logout" />

);

AuthUser.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};

export default AuthUser;


/**
<Drawer className="dashboard-drawer" containerStyle={{marginTop: '70px', width: '250px'}} open={false}>
  <MenuItem>Menu Item</MenuItem>
  <MenuItem>Menu Item 2</MenuItem>
</Drawer>
*/
