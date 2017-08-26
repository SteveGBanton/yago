import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import Menu from 'material-ui/Menu';
import { Link } from 'react-router-dom';

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

import './Authenticated.scss';

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

const Authenticated = ({ loggingIn, authenticated, component, ...rest }) => (
  <div className="dashboard">
    <div className="dashboard-menu">
      <Drawer className="dashboard-drawer" containerStyle={{width: '250px', zIndex: '1000', marginTop: '55px'}} open>
        <Link to="/documents"><MenuItem primaryText="View Documents" leftIcon={<RemoveRedEye />} /></Link>
        <Link to="/documents/new"><MenuItem primaryText="New Document" leftIcon={<PersonAdd />} /></Link>
        <MenuItem primaryText="Get links" leftIcon={<ContentLink />} />
        <Divider />
        <MenuItem primaryText="Make a copy" leftIcon={<ContentCopy />} />
        <MenuItem primaryText="Download" leftIcon={<Download />} />
        <Divider />
        <MenuItem primaryText="Remove" leftIcon={<Delete />} />
      </Drawer>
    </div>
    <div className="inner-route">
        <Route
          {...rest}
          render={props => (
            authenticated
            ? (React.createElement(component, { ...props, loggingIn, authenticated }))
            : (<Redirect to="/logout" />)
          )}
        />
    </div>
  </div>
);

Authenticated.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};

export default Authenticated;


/**
<Drawer className="dashboard-drawer" containerStyle={{marginTop: '70px', width: '250px'}} open={false}>
  <MenuItem>Menu Item</MenuItem>
  <MenuItem>Menu Item 2</MenuItem>
</Drawer>
*/
