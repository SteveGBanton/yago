import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { startCase, chunk } from 'lodash'

import {Tabs, Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import DocumentsCollection from '../../../../api/Documents/Documents';
import Loading from '../../../components/Loading/Loading.jsx';

import './ClientDocuments.scss';

const styles = {
  propContainer: {
    width: 200,
    overflow: 'hidden',
    margin: '20px auto 0',
  },
  propToggleHeader: {
    margin: '20px auto 10px',
  },
};

const handleRemove = (documentId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('documents.remove', {documentId}, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document deleted!', 'success');
      }
    });
  }
};

class ClientDocuments extends React.Component {

  constructor(props) {
    super(props);

    this.state = ({
      })
  }

  render() {
    const { loading, documents, match, history } = this.props;

    return (!loading ? (
      <div className="Documents">

        <h1>Documents</h1>

        <Tabs
            style={{width: '100%', marginBottom: "30px"}}
            inkBarStyle={{backgroundColor: '#00BCD4'}}
            tabItemContainerStyle={{
              backgroundColor: 'white',
              boxShadow: '0px 2px 0px 0px #888888',
            }}
          >

            <Tab
              label="Item One"
              style={{color: "black"}}
            >
          <div className="tab-container">
            <h2>Tab One</h2>

          </div>
        </Tab>
        <Tab
          label="Item Two"
          style={{color: 'black'}}
          >
          <div className="tab-container">
            <h2>Tab Two</h2>
            <p>
              This is another example tab.
            </p>

          </div>
        </Tab>
        <Tab
          label="onActive"
          style={{color: 'black'}}
        >
          <div className="tab-container">
            <h2>Tab Three</h2>
            <p>
              This is a third example tab.
            </p>
          </div>
        </Tab>

            <Tab label="Tab A" value="a" style={{color: 'black'}}>
              <div className="tab-container">
                <h2>Controllable Tab A</h2>
                <p>
                  Tabs are also controllable if you want to programmatically pass them their values.
                  This allows for more functionality in Tabs such as not
                  having any Tab selected or assigning them different values.
                </p>
              </div>
            </Tab>
            <Tab label="Tab B" value="b" style={{color: 'black'}}>
              <div className="tab-container">
                <h2>Controllable Tab B</h2>
                <p>
                  This is another example of a controllable tab. Remember, if you
                  use controllable Tabs, you need to give all of your tabs values or else
                  you wont be able to select them.
                </p>
              </div>
            </Tab>
          </Tabs>

        <div className="page-header clearfix">
          <Link className="btn btn-success pull-right" to={`${match.url}/new`}>+ Add Document</Link>
        </div>
        {documents.length ? <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Last Updated</th>
              <th>Created</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {documents.map(({ _id, title, createdAt, updatedAt }) => (
              <tr key={_id}>
                <td>{title}</td>
                <td>{timeago(updatedAt)}</td>
                <td>{monthDayYearAtTime(createdAt)}</td>
                <td>
                  <RaisedButton
                    onClick={() => history.push(`${match.url}/${_id}`)}
                  >View</RaisedButton>
                </td>
                <td>
                  <RaisedButton
                    onClick={() => handleRemove(_id)}
                  >Delete</RaisedButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table> : <p>ALERT No documents yet!</p>}
      </div>
    ) : <Loading />);
  }
}

ClientDocuments.propTypes = {
  loading: PropTypes.bool.isRequired,
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('documents');
  return {
    loading: !subscription.ready(),
    documents: DocumentsCollection.find({ owner: Meteor.userId() }).fetch(),
  };
}, ClientDocuments);
