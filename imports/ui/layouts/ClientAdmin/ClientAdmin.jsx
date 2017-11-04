import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Link } from 'react-router-dom';

import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Person from 'material-ui/svg-icons/social/person';
import Divider from 'material-ui/Divider';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Download from 'material-ui/svg-icons/file/file-download';
import Delete from 'material-ui/svg-icons/action/delete';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import Navigation from '../../components/Navigation/Navigation';

import './ClientAdmin.scss';

const validateUser = function validateCurrentUser(role, group) {
  return (Roles.userIsInRole(Meteor.userId(), [role], group));
};

export default class ClientAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.state = {
      menuOpen: true,
    };
  }

  toggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  }

  render() {
    const { loggingIn, authenticated, component, user, ...rest } = this.props;
    return (
      <div className="dashboard">

        <Navigation {...this.props} toggleMenu={this.toggleMenu} />

        <div className={(this.state.menuOpen) ? "dashboard-menu" : "dashboard-menu-closed"}>
          <Drawer
            className="dashboard-drawer"
            containerStyle={{ width: '250px', zIndex: '1000', marginTop: '55px', backgroundColor: '#03A9F4', paddingTop: "20px" }}
            style={{ color: 'white' }}
            open={this.state.menuOpen}
          >
            <Link to="/add">
              <MenuItem
                primaryText="Create New Shortlink"
                leftIcon={
                  <RemoveRedEye
                    color="rgba(255,255,255,0.5)"
                    style={{ paddingLeft: "10px" }}
                  />}
              />
            </Link>
            <Link to="/links">
              <MenuItem
                primaryText="View My Shortlinks"
                leftIcon={
                  <PersonAdd
                    color="rgba(255,255,255,0.5)"
                    style={{ paddingLeft: "10px" }}
                  />}
              />
            </Link>
            <Divider
              style={{ backgroundColor: "#0288D1", marginTop: "16px", marginBottom: "16px" }}
            />
          </Drawer>
        </div>
        <div className={(this.state.menuOpen) ? "inner-route" : "inner-route-full"}>
          <Route
            {...rest}
            render={props => (
              authenticated ?
                (React.createElement(component, {
                  ...props,
                  loggingIn,
                  authenticated,
                  user,
                }))
                :
                (<Redirect to="/" />)
            )}
          />
        </div>
      </div>
    );
  }
}

ClientAdmin.defaultProps = {
  user: {},
};

ClientAdmin.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  user: PropTypes.shape({}),
};
