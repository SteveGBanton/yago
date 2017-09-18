import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Divider from 'material-ui/Divider';

import './Navigation.scss';

const styles = {
  toolbar: {
    backgroundColor: '#37474f',
    width: '100%',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: 1200,
    boxShadow: 'rgba(0, 0, 0, 0.18) 0px 2px 6px, rgba(0, 0, 0, 0.18) 0px 3px 4px'
  },
}

const rolesMenu = function rolesMenu(roles) {
  let groupsRoles = [];
  const groups = Object.keys(roles);

  groups.forEach((group) => {
    let rolesForEach = roles[group]
    rolesForEach.forEach((role) => {
      groupsRoles.push({group, role})
    })

  });

  return groupsRoles
}

const changeCurrent = function changeCurrent(currentOrg, currentRole, history) {

  return function change() {

    Meteor.call('users.changeCurrentOrgRole',
      { currentOrg, currentRole },
      (err, res) => {
          if (err) {
            // TODO Handle err properly.
            Bert.alert(err.reason, 'danger');
            console.log(err)
          } else {
            history.push(`/${currentOrg}/${currentRole}/dashboard`)
          }

      }
    )
  }

}

const Navigation = props => {
  const { authenticated, history, user, toggleMenu } = props;
  const current = ( authenticated ) ? user.current : '';
  return (
    <Toolbar style={styles.toolbar}>
      <ToolbarGroup>
        <MenuIcon
          color="rgba(255,255,255,0.7)"
          hoverColor="rgba(255,255,255,0.9)"
          className="pointer"
          onClick={toggleMenu}
        />
        <ToolbarSeparator />
        <ToolbarTitle style={{color: 'white', paddingLeft: '20px'}} text={(user) ? user.profile.orgName : 'Academy App' } />
      </ToolbarGroup>
      <ToolbarGroup>
        {authenticated
          ? <Link to={`/${current.currentOrg}/${current.currentRole}/dashboard`}><RaisedButton label="Dashboard Home" backgroundColor="#03A9F4" labelStyle={{color: 'white'}} /></Link>
          : ''
        }

        <IconMenu
          menuStyle={{width: "250px"}}
          onItemTouchTap={() => this.open = null}
          iconButtonElement={
            <IconButton touch={true}>
              <NavigationExpandMoreIcon color="white" />
            </IconButton>
          }
        >

        {authenticated
          ? rolesMenu(user.roles).map((role, index) =>
            <MenuItem
              style={{fontSize: "14px"}}
              key={index}
              primaryText={`${role.group}`}
              onClick={changeCurrent(role.group, role.role, history)}
              secondaryText={`(${role.role})`}
              leftIcon={
                (user && current.currentOrg === role.group && current.currentRole === role.role)
                ? <FontIcon className="material-icons">checkmark</FontIcon>
                : ''
              }
            />
          )
          : ''
        }

        {authenticated
          ? <Divider />
          : ''
        }

        <MenuItem primaryText="Clear Config" />
        <MenuItem primaryText="New Config" rightIcon={<PersonAdd />} />
        <MenuItem primaryText="Project" rightIcon={<FontIcon className="material-icons">search</FontIcon>} />
        <MenuItem
          primaryText="Workspace"
          rightIcon={
            <FontIcon className="material-icons" style={{color: '#559'}}>settings</FontIcon>
          }
        />

        {authenticated
          ? <MenuItem primaryText="Edit Profile" onClick={() => history.push(`/${current.currentOrg}/${current.currentRole}/profile`)} />
          : ''
        }

        {authenticated
          ? <MenuItem primaryText="Sign out" onClick={() => Meteor.logout()} />
          : <MenuItem primaryText="Sign in" onClick={() => history.push('/login')} />
        }

        {authenticated
          ? ''
          : <MenuItem primaryText="Create Account" onClick={() => history.push('/signup')} />
        }

        </IconMenu>
      </ToolbarGroup>
    </Toolbar>
)}

Navigation.defaultProps = {
  name: '',
};

Navigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

export default withRouter(Navigation);
