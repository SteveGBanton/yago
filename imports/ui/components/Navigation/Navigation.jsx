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

import './Navigation.scss';

const styles = {
  toolbar: {
    backgroundColor: '#37474f',
    width: '100%',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: 1200,
    boxShadow: 'rgba(0, 0, 0, 0.18) 0px 2px 6px, rgba(0, 0, 0, 0.18) 0px 3px 4px',
  },
};

const Navigation = (props) => {
  const {
    authenticated, history, user, toggleMenu,
  } = props;
  const current = (authenticated) ? user.current : '';

  // Test if we are on a page where we'd like to disable the menu button
  const re = /^\/files/g;
  const filesPage = re.test(history.location.pathname);

  return (
    <Toolbar style={styles.toolbar}>
      <ToolbarGroup>
        <MenuIcon
          color={(!toggleMenu) ? "rgba(255,255,255,0)" : "rgba(255,255,255,0.7)"}
          hoverColor={(!toggleMenu) ? "rgba(255,255,255,0)" : "rgba(255,255,255,0.9)"}
          className={(!toggleMenu) ? "" : "pointer"}
          onClick={toggleMenu}
        />
        <ToolbarTitle style={{ color: 'white', paddingLeft: '20px' }} text='Yago' />
      </ToolbarGroup>
      <ToolbarGroup>
        {authenticated
          ? <Link to="/add"><RaisedButton label="Add Link" backgroundColor="#03A9F4" labelStyle={{ color: 'white' }} /></Link>
          : ''
        }
        <IconMenu
          menuStyle={{ width: "250px" }}
          onItemTouchTap={() => this.open = null}
          iconButtonElement={
            <IconButton touch>
              <NavigationExpandMoreIcon color="white" />
            </IconButton>
          }
        >
          {authenticated ?
            <MenuItem
              primaryText="Log out"
              onClick={() => Meteor.logout()}
              rightIcon={
                <FontIcon className="material-icons" style={{ color: '#559' }}>settings</FontIcon>
              }
            />
            :
            <MenuItem
              primaryText="Log in"
              onClick={() => { location.href = "/login"; }}
              rightIcon={
                <FontIcon className="material-icons" style={{ color: '#559' }}>settings</FontIcon>
              }
            />
          }

        </IconMenu>
      </ToolbarGroup>
    </Toolbar>
  );
};

Navigation.defaultProps = {
  name: '',
};

Navigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

export default withRouter(Navigation);
