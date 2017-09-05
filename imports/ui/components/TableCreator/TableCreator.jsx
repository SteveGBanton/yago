import React from "react";
import PropTypes from 'prop-types';
import ReactTable from "react-table";
import LinearProgress from 'material-ui/LinearProgress';
import { monthDayYearAtTime } from '@cleverbeagle/dates';
import Loading from '../Loading/Loading';


// import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import "react-table/react-table.css";
// import { makeData, Logo, Tips } from "./Utils";

/**

  Purpose of wrapper:
  Receive data and customization options from parent component.
  Format it for React-Table.

  Required props/pubs for component rendering table:
  Pub - whatever data user has permission to access is published from
  server, possibly filtered by an argument - eg Before date, Form used, Search Value.
  Sub - data from pub, filtered (passes an arg to Pub to get only certain
  data published - maybe to accept docs from before a certain date, or narrow
  number of docs published in some other way narrower, the better).
  Should restrict # of docs pulling from DB in some way.
  .fetch() - subscription filtered again to show user-selected data.

  Creates:
  Column select - Can select what columns to include in filterRows.
  (may be selecting from customSchema)
  FilterColumns - user selects what columns should appear in table. Only ~2-7 rows allowd.
  tableData - data to be rendered, chunked into arrays of ~50. using _.chunk()
  Selections for selected Docs - eg. Edit/View Button linking to full document
  rearrange Data by .sort - Alphbetical or Numerical sorting by table header.
  Rearranges data into state, pushes that to table each time it is.

  Table
  Has no state for data... only state for toggles.

  Required props for table:
  toggles - what type of table is it? different components allowed etc.
  filterColumns - what data should appear in the table?
  This will be a subset of customSchema, determined on page rendering component.
  tableData - data sent to the table, restricted to filterColumns.

  Creates:
  selectedRows state - which rows have been selected?
  sent to onRowSelection method, attached to ID somehow so those selected,
  stay selected on pagination.
  Rows - each row is rendered from selected data.
  Can click to filter by table headers - SENDS A FUNCTION TO TABLE PARENT -
  onClick each heading toggles a filter for all data brought in (not just 50 in the table)
  Button below table controls which page is present on table.

  React-Table
  props:
  filterable={true}
  columns={[{},{},{},{}]}
    filterMethod
    sortMethod
    Cell:
    Aggregated:
  pivotBy={[options]}
  defaultPageSize
  noDataText=''

  Wrap this component with a wrapper that accepts data and
  funnels it into the React-Table, and specifies these options.

  Send the wrapper data in one obj, and options in another,
  and should render the component correctly.

  Is this wrapper necessary? The wrapper can be used to turn
  schema data into the correct format for the table, so that if
  schema data changes the wrapper can be edited, and not every
  module that uses the table.

  Wrapper can also be used to add custom filter or options around
  the table that are not provided by React Table.

  Wrapper configures data into table-friendly format - only data you want to pass in.

const filterColumns = [
  'lastUpdated',
  'title',
  'created',
  'author',
];

const columns = [
  {
    Header: "Last Name",
    accessor: "lastName",
  },
  {
    Header: "Created",
    id: "created",
    accessor: d => d.created,
  },
  {
    Header: "DocID",
    accessor: "docid",
    Cell: row => <LinearProgress mode="determinate" value={50} />,
  },
  {
    Header: "Last Updated",
    accessor: "lastUpdated",
  }
];

*/

const createCols = function createCols(schema) {
  const columnOutput = [];
  schema.forEach((field) => {
    const newField = {
      Header: field.fieldName,
      accessor: field.fieldId,
    };

    if (field.cellType === 'linear-progress') {
      newField.Cell = (row => ((row.value) ? <LinearProgress mode="determinate" value={row.value} /> : ''));
    }

    if (field.cellType === 'date') {
      // newField.Cell = (row => ((row.value) ? monthDayYearAtTime(row.value) : ''));
      newField.id = field.fieldId;
      newField.accessor = (d => (
        (d[field.fieldId])
        ? monthDayYearAtTime(String(d[field.fieldId]))
        : ''));
    }

    columnOutput.push(newField);
  });

  return columnOutput;
};

const TableCreator = props => (
  <div>
    <ReactTable
      data={props.tableData}
      noDataText={<Loading />}
      columns={createCols(props.schema)}
      defaultPageSize={50}
      style={{
        height: "550px",
      }}
      filterable
      className="-striped -highlight"
    />
  </div>
);

TableCreator.propTypes = {
  tableData: PropTypes.array.isRequired,
  schema: PropTypes.array.isRequired,
};

export default TableCreator;
