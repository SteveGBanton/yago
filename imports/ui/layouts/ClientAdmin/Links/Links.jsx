import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import Clipboard from 'clipboard';
import matchSorter from 'match-sorter';

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
                  id: 'edit-col',
                  accessor: d => d,
                  sortable: false,
                  filterable: false,
                  width: 100,
                  Cell: row => (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <FontIcon
                        className="material-icons pointer"
                        style={{ color: '#559', marginRight: 5 }}
                        onClick={() => history.push(`/view-link/${row.original.shortLink}`)}
                      >
                        remove_red_eye
                      </FontIcon>

                      <FontIcon
                        className="material-icons pointer"
                        style={{ color: '#559', marginRight: 5 }}
                        onClick={() => handleRemove(row.original._id)}
                      >
                        delete
                      </FontIcon>

                      <FontIcon
                        className="material-icons pointer"
                        style={{ color: '#559' }}
                        onClick={() => window.open(row.original.url, '_blank')}
                      >
                        open_in_new
                      </FontIcon>

                    </div>
                  ),
                },
                {
                  Header: 'URL',
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["url"] }),
                  accessor: 'url',
                  filterAll: true,
                  minWidth: 250,
                  Cell: row => (
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', fontSize: 12 }}
                    >
                      {row.value}
                    </div>
                  ),
                },
                {
                  Header: 'Created',
                  id: 'createdAt',
                  filterAll: true,
                  minWidth: 200,
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["createdAt"] }),
                  accessor: (d => (
                    (d.createdAt)
                    ? monthDayYearAtTime(d.createdAt)
                    : '')),
                  Cell: row => (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: 10 }}
                    >
                      {row.value}
                    </div>
                  ),
                },
                {
                  Header: 'Clicks',
                  accessor: 'clicks',
                  maxWidth: 150,
                  minWidth: 100,
                  Cell: row => (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
                    >
                      {row.value}
                    </div>
                  ),
                },
                {
                  Header: 'Copy YagoLink',
                  id: 'shortLink',
                  filterAll: true,
                  minWidth: 220,
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["shortLink"] }),
                  accessor: d => (`https://yagosite.herokuapp.com/${d.shortLink}`),
                  Cell: row => (
                    <div
                      className="copy-btn pointer"
                      onClick={() => Bert.alert('Link Copied!', 'success')}
                      role="button"
                      tabIndex={0}
                      onKeyPress={() => Bert.alert('Link Copied!', 'success')}
                      data-clipboard-text={`${row.value}`}
                    >
                      {`${row.value}`}
                      <FontIcon
                        className="material-icons"
                        style={{ color: '#559', marginLeft: 5, fontSize: 12 }}
                      >
                        content_copy
                      </FontIcon>
                    </div>
                  ),
                },
              ],
            },
          ]}
        filterable
        defaultSorted={[
            {
              id: 'createdAt',
              desc: true,
            },
          ]}
        defaultPageSize={10}
        noDataText="Please add links!"
        className="-striped -highlight"
      />
      <br />
      {
      (links.length)
      ? `${links.length} yagolink(s) created.`
      : ''
      }

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
