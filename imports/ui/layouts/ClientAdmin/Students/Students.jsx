import React from "react";
// import { makeData } from "./Utils";
import { Link } from 'react-router-dom';
import TableCreator from '../../../components/TableCreator/TableCreator';
import { makeData } from '../../../components/TableCreator/Utils';
import Loading from '../../../components/Loading/Loading';

const customSchema = [
  {
    fieldName: 'First Name',
    fieldId: 'firstName',
    type: 'text-field',
    required: 'false',
    public: true,
  },
  {
    fieldName: 'Progress',
    fieldId: 'progress',
    type: 'text-field',
    required: 'false',
    cellType: 'linear-progress',
    public: true,
  },
  {
    fieldName: 'Relationship Status',
    fieldId: 'status',
    type: 'text-field',
    required: 'false',
    public: true,
  },
  {
    fieldName: 'Date Created',
    fieldId: 'dateCreated',
    type: 'text-field',
    required: 'false',
    cellType: 'date',
    public: true,
  },
  {
    fieldName: 'Description',
    fieldId: 'text-field-1',
    type: 'text-field',
    required: 'false',
    public: true,
  },
  {
    fieldName: 'Black Row',
    fieldId: 'blackRow',
    type: 'text-field',
    required: 'false',
    public: true,
  },
  {
    fieldName: 'New Row',
    fieldId: 'newRow',
    type: 'text-field',
    required: 'false',
    public: true,
  },
  {
    fieldName: 'Blanks',
    fieldId: 'blanks',
    type: 'text-field',
    required: 'false',
    public: true,
  },
  {
    fieldName: 'Avatar',
    fieldId: 'avatar',
    type: 'image',
    required: 'false',
    cellType: 'image',
    public: true,
  },
];

const customSchema2 = [
  {
    fieldName: 'Avatar',
    fieldId: 'avatar',
    type: 'image-field',
    required: 'false',
    cellType: 'image',
    public: true,
  },
  {
    fieldName: 'Created',
    fieldId: 'created',
    type: 'text-field',
    required: 'false',
    cellType: 'date',
  },
  {
    fieldName: 'Author',
    fieldId: 'author',
    type: 'text-field',
    required: 'false',
  },
  {
    fieldName: 'DocID',
    fieldId: 'docid',
    type: 'text-field',
    required: 'false',
  },
  {
    fieldName: 'Last Updated',
    fieldId: 'lastUpdated',
    type: 'text-field',
    required: 'false',
    cellType: 'date',
  },
];

export default class Students extends React.Component {

  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.getSelected = this.getSelected.bind(this);
    this.state = ({
      tableData: makeData(500),
      schema: customSchema,
    });
  }

  componentDidMount() {

  }

  getSelected(selected) {
    // console.log(selected);
  }

  getData() {

    // Meteor.call('utility.remoteGet', 'https://f001.backblazeb2.com/file/boldpoint-test/tableData2short.json', (err, res) => {
    //   this.setState({
    //     tableData: JSON.parse(res.content),
    //     loading: false,
    //   });
    // });
  }

  render() {
    return (
      <div>
        <h1>Manage Students</h1>
        <Link to="students/add/">+ Add</Link>
        {(this.state.tableData !== undefined || this.state.length !== 0)
          ?
            <TableCreator
              history={this.props.history}
              user={this.props.user}
              tableName="Default Data"
              getSelected={this.getSelected}
              tableData={this.state.tableData}
              schema={this.state.schema}
            />
          : <Loading />
        }

      </div>
    );
  }
}
