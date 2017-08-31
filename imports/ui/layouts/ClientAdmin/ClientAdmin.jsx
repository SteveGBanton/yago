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

import './ClientAdmin.scss';

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
  if (Roles.userIsInRole(Meteor.userId(), [role], group)) {
    return true
  }
  return false
}

const ClientAdmin = ({ loggingIn, authenticated, component, user, ...rest }) => (
    <div className="dashboard">

      <div className="dashboard-menu">
        <Drawer className="dashboard-drawer" containerStyle={{width: '250px', zIndex: '1000', marginTop: '55px', backgroundColor: '#03A9F4', paddingTop: "20px"}} style={{color: 'white'}} open>
          <Link to={`/${rest.computedMatch.params.username}/admin/documents`}><MenuItem primaryText="View Documents" leftIcon={<RemoveRedEye color="rgba(255,255,255,0.5)" style={{paddingLeft: "10px"}}/>} /></Link>
          <Link to={`/${rest.computedMatch.params.username}/admin/documents/new`}><MenuItem primaryText="New Document" leftIcon={<PersonAdd color="rgba(255,255,255,0.5)" style={{paddingLeft: "10px"}}/>} /></Link>
          <MenuItem primaryText="Get links" leftIcon={<ContentLink color="rgba(255,255,255,0.5)" style={{paddingLeft: "10px"}} />} />
          <Divider style={{backgroundColor: "#0288D1", marginTop: "16px", marginBottom: "16px"}} />
          <MenuItem primaryText="Make a copy" leftIcon={<ContentCopy color="rgba(255,255,255,0.5)" style={{paddingLeft: "10px"}} />} />
          <MenuItem primaryText="Download" leftIcon={<Download color="rgba(255,255,255,0.5)" style={{paddingLeft: "10px"}} />} />
          <MenuItem primaryText="Remove" leftIcon={<Delete color="rgba(255,255,255,0.5)" style={{paddingLeft: "10px"}} />} />
        </Drawer>
      </div>
      <div className="inner-route">
        <Route
          {...rest}
          render={props => (
            authenticated && validateUser('admin', rest.computedMatch.params.username)
            ? (React.createElement(component, { ...props, loggingIn, authenticated, user }))
            : (<Redirect to="/logout" />)
          )}
        />
      </div>
    </div>
);

ClientAdmin.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};

export default ClientAdmin;
