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

import './ClientAdmin.scss';

const validateUser = function validateCurrentUser(role, group) {
  return (Roles.userIsInRole(Meteor.userId(), [role], group));
};

export default class ClientAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
    };
  }
  render() {
    // console.log(Meteor.user());
    // console.log(this.props.students);
    // console.log(this.props.uploads);
    const { loggingIn, authenticated, component, user, menuOpen, ...rest } = this.props;
    return (
      <div className="dashboard">

        <div className={(menuOpen) ? "dashboard-menu" : "dashboard-menu-closed"}>
          <Drawer
            className="dashboard-drawer"
            containerStyle={{ width: '250px', zIndex: '1000', marginTop: '55px', backgroundColor: '#03A9F4', paddingTop: "20px" }}
            style={{ color: 'white' }}
            open={menuOpen}
          >
            <Link to={`/${rest.computedMatch.params.username}/admin/documents`}>
              <MenuItem
                primaryText="View Documents"
                leftIcon={
                  <RemoveRedEye
                    color="rgba(255,255,255,0.5)"
                    style={{ paddingLeft: "10px" }}
                  />}
              />
            </Link>
            <Link to={`/${rest.computedMatch.params.username}/admin/documents/new`}>
              <MenuItem
                primaryText="New Document"
                leftIcon={
                  <PersonAdd
                    color="rgba(255,255,255,0.5)"
                    style={{ paddingLeft: "10px" }}
                  />}
              />
            </Link>
            <Link to={`/${rest.computedMatch.params.username}/admin/students`}>
              <MenuItem
                primaryText="Manage Students"
                leftIcon={
                  <Person
                    color="rgba(255,255,255,0.5)"
                    style={{ paddingLeft: "10px" }}
                  />}
              />
            </Link>
            <Divider
              style={{ backgroundColor: "#0288D1", marginTop: "16px", marginBottom: "16px" }}
            />
            <MenuItem
              primaryText="Make a copy"
              leftIcon={
                <ContentCopy
                  color="rgba(255,255,255,0.5)"
                  style={{ paddingLeft: "10px" }}
                />}
            />
            <MenuItem
              primaryText="Download"
              leftIcon={
                <Download
                  color="rgba(255,255,255,0.5)"
                  style={{ paddingLeft: "10px" }}
                />}
            />
            <MenuItem
              primaryText="Remove"
              leftIcon={
                <Delete
                  color="rgba(255,255,255,0.5)"
                  style={{ paddingLeft: "10px" }}
                />}
            />
          </Drawer>
        </div>
        <div className={(menuOpen) ? "inner-route" : "inner-route-full"}>
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
  }
}

ClientAdmin.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  menuOpen: PropTypes.bool.isRequired,
};
