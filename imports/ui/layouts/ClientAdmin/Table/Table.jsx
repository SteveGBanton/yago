import React from "react";
// import { makeData } from "./Utils";
import TableCreator from '../../../components/TableCreator/TableCreator';
import Loading from '../../../components/Loading/Loading';
import { makeData } from '../../../components/TableCreator/Utils';


const customSchema1 = [
  {
    fieldName: 'First Name',
    fieldId: 'firstName',
    type: 'text-field',
    required: 'false',
  },
  {
    fieldName: 'Progress',
    fieldId: 'progress',
    type: 'text-field',
    required: 'false',
    cellType: 'linear-progress',
  },
  {
    fieldName: 'Relationship Status',
    fieldId: 'status',
    type: 'text-field',
    required: 'false',
  },
  {
    fieldName: 'Date Created',
    fieldId: 'dateCreated',
    type: 'text-field',
    required: 'false',
    cellType: 'date',
  },
  {
    fieldName: 'Description',
    fieldId: 'text-field-1',
    type: 'text-field',
    required: 'false',
  },
];

const customSchema = [
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

export default class TableDisplay extends React.Component {

  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.state = ({
      tableData: [],
      loading: true,
      schema: customSchema,
    });
  }

  componentWillMount() {
    this.getData();
  }

  getData() {
    Meteor.call('utility.remoteGet', 'https://f001.backblazeb2.com/file/boldpoint-test/tableData2short.json', (err, res) => {
      this.setState({
        tableData: JSON.parse(res.content),
        loading: false,
      });
    });
  }

  render() {
    return (
      <div>
        <h1>Table Display</h1>
        <TableCreator
          tableData={this.state.tableData}
          schema={this.state.schema}
        />
      </div>
    );
  }
}
