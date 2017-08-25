import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import PublicNavigation from '../PublicNavigation/PublicNavigation';
import AuthenticatedNavigation from '../AuthenticatedNavigation/AuthenticatedNavigation';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';

import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar'

import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ContentLink from 'material-ui/svg-icons/content/link';
import Divider from 'material-ui/Divider';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Download from 'material-ui/svg-icons/file/file-download';
import Delete from 'material-ui/svg-icons/action/delete';

// Old
import { Navbar } from 'react-bootstrap';

import './Navigation.scss';

const styles = {
  toolbar: {
    backgroundColor: '#0277BD',
    width: '100%',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: 1200,
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
  },
}

const Navigation = props => (
  <Toolbar style={styles.toolbar}>
    <ToolbarGroup>
      <ToolbarTitle style={{color: 'white'}} text="Creixent" />
    </ToolbarGroup>
    <ToolbarGroup>
      {props.authenticated
        ? <Link to="/dashboard"><RaisedButton label="Dashboard Home" primary={true} /></Link>
        : ''
      }
      <IconMenu
        onItemTouchTap={() => this.open = null}
        iconButtonElement={
          <IconButton touch={true}>
            <NavigationExpandMoreIcon color="white" />
          </IconButton>
        }
      >
        <MenuItem primaryText="Clear Config" />
        <MenuItem primaryText="New Config" rightIcon={<PersonAdd />} />
        <MenuItem primaryText="Project" rightIcon={<FontIcon className="material-icons">search</FontIcon>} />
        <MenuItem
          primaryText="Workspace"
          rightIcon={
            <FontIcon className="material-icons" style={{color: '#559'}}>settings</FontIcon>
          }
        />
        {props.authenticated
          ? <MenuItem primaryText="Edit Profile" onClick={() => props.history.push('/profile')} />
          : ''
        }
        {props.authenticated
          ? <MenuItem primaryText="Sign out" onClick={() => Meteor.logout()} />
          : <MenuItem primaryText="Sign in" onClick={() => props.history.push('/login')} />
        }

      </IconMenu>
    </ToolbarGroup>
  </Toolbar>
);

/**

<AppBar
  style={{backgroundColor: '#0277BD', position: 'fixed', top: '0', left: '0'}}
  title="Creixent"
  iconElementRight={props.authenticated
    ? <FlatButton label="Dashboard" href="/dashboard" /><FlatButton label="Sign out" onClick={() => Meteor.logout()} />
    : (<div><FlatButton label="Sign in" href="/login" /><FlatButton label="Sign in" href="/login" /></div>)}
  showMenuIconButton={false}
/>

const Navigation = props => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">Pup</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      {!props.authenticated ? <PublicNavigation /> : <AuthenticatedNavigation {...props} />}
    </Navbar.Collapse>
  </Navbar>
);
*/

Navigation.defaultProps = {
  name: '',
};

Navigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

export default withRouter(Navigation);
