import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import "react-table/react-table.css";
import ReactTable from "react-table";
import Clipboard from 'clipboard'

import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

import ShortLinks from '../../../../api/ShortLinks/ShortLinks';
import Loading from '../../../components/Loading/Loading.jsx';

import './Links.scss';

const handleRemove = (_id) => {
  Meteor.call('link.remove', { _id }, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Link deleted!', 'success');
    }
  });
};

const Links = ({
  loading, links, match, history,
}) => (
  !loading ? (
    <div className="links">
      {(() => { const clipboard = new Clipboard('.copy-btn'); })()}
      <h1>Links</h1>

      <ReactTable
        data={links}
        columns={[
            {
              columns: [
                {
                  accessor: "shortLink",
                  sortable: false,
                  filterable: false,
                  width: 50,
                  Cell: row => (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <FontIcon
                        className="material-icons pointer"
                        style={{ color: '#559' }}
                        onClick={() => history.push(`/view-link/${row.value}`)}
                      >
                        edit
                      </FontIcon>
                    </div>
                  ),
                },
                {
                  accessor: "_id",
                  sortable: false,
                  filterable: false,
                  width: 50,
                  Cell: row => (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <FontIcon
                        className="material-icons pointer"
                        style={{ color: '#559' }}
                        onClick={() => handleRemove(row.value)}
                      >
                        delete
                      </FontIcon>
                    </div>
                  ),
                },
                {
                  sortable: false,
                  filterable: false,
                  accessor: "url",
                  width: 50,
                  Cell: row => (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <FontIcon
                        className="material-icons pointer"
                        style={{ color: '#559' }}
                        onClick={() => window.open(row.value, '_blank')}
                      >
                        open_in_new
                      </FontIcon>
                    </div>
                  ),
                },
                {
                  Header: "URL",
                  accessor: "url",
                  Cell: row => (
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
                      {row.value}
                    </div>
                  ),
                },
                {
                  Header: "Created",
                  accessor: "createdAt",
                  Cell: row => (
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
                      {monthDayYearAtTime(row.value)}
                    </div>
                  ),
                },
                {
                  Header: "Clicks",
                  accessor: "clicks",
                  maxWidth: 150,
                  Cell: row => (
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
                      {row.value}
                    </div>
                  ),
                },
                {
                  Header: "Copy ShortLink",
                  accessor: "shortLink",
                  Cell: row => (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                      {`http://yago.site/${row.value}  `}
                      <FontIcon
                        data-clipboard-text={`http://yago.site/${row.value}`}
                        className="material-icons pointer copy-btn"
                        style={{ color: '#559', marginLeft: 5 }}
                        onClick={() => Bert.alert('Link Copied!', 'success')}
                      >
                        content_copy
                      </FontIcon>
                    </div>
                  ),
                },
              ],
            },
          ]}
        defaultSorted={[
            {
              id: "createdAt",
              desc: true,
            },
          ]}
        filterable
        defaultPageSize={10}
        className="-striped -highlight"
      />

    </div>
  )
    :
    <Loading />
);

Links.propTypes = {
  loading: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('shortLinks');
  const links = ShortLinks.find({ owner: Meteor.userId() }).fetch();

  return {
    loading: !subscription.ready(),
    links,
  };
}, Links);
