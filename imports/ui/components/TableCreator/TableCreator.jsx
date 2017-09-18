import "react-table/react-table.css";
import React from "react";
import PropTypes from 'prop-types';
import ReactTable from "react-table";
import { timeago } from '@cleverbeagle/dates';
import { Bert } from 'meteor/themeteorchef:bert';
import { Link } from 'react-router-dom';

import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import Edit from 'material-ui/svg-icons/image/edit';
import FilterList from 'material-ui/svg-icons/content/filter-list';
import Visibility from 'material-ui/svg-icons/action/visibility';
import ViewColumn from 'material-ui/svg-icons/action/view-column';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import Add from 'material-ui/svg-icons/content/add';
import Clear from 'material-ui/svg-icons/content/clear';
import Remove from 'material-ui/svg-icons/content/remove';
import IconButton from 'material-ui/IconButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';

import AddCircle from 'material-ui/svg-icons/content/add-circle';
import RemoveCircle from 'material-ui/svg-icons/content/remove-circle';

import Loading from '../Loading/Loading';

import "./index.scss";

export default class TableCreator extends React.Component {

  constructor(props) {
    super(props);
    this.createCols = this.createCols.bind(this);
    this.createBulkEditCols = this.createBulkEditCols.bind(this);
    this.selectOne = this.selectOne.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.selectAllCurrentRows = this.selectAllCurrentRows.bind(this);
    this.deselectOne = this.deselectOne.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
    this.getCurrentRows = this.getCurrentRows.bind(this);
    this.filterToggle = this.filterToggle.bind(this);
    this.filteredCols = this.filteredCols.bind(this);
    this.toggleColumnDrawer = this.toggleColumnDrawer.bind(this);
    this.addAllColumns = this.addAllColumns.bind(this);
    this.removeAllColumns = this.removeAllColumns.bind(this);

    this.getCurrentSelectedRows = this.getCurrentSelectedRows.bind(this);
    this.deselectAllCurrentRows = this.deselectAllCurrentRows.bind(this);

    this.currentRows = [];
    this.currentSelectedRows = [];
    this.dataLength = 0;
    this.allCols = [];

    this.state = {
      activeCols: [],
      filterDrawerOpen: false,
      filterable: true,
      selected: [],
      selectedIndexes: {},
    };
  }

  // TODO Organize these functions or put them in different files. 600 Lines may be too long.

  // on mount, get columns that will be displayed and those that will be active from props.schema
  componentWillMount() {

    // Set initial allCols and activeCols in the table using the first 5 rows of the schema.

    const allColumns = [];
    const allActiveColumns = [];

    this.props.schema.forEach((item) => {
      if (!item.public) {
        return
      };

      allColumns.push(item);
    })

    this.allCols = [...allColumns];

    // Only set activeCols like this initially, after receiving props.
    if (this.allCols.length > 0 && this.state.activeCols.length === 0) {
      this.state.activeCols = [...this.allCols.slice(0, 4)];
    }
  }

  // Gets only currently displayed rows in window, from Main React Table
  getCurrentRows(rows) {
    this.currentRows = rows;
  }

  // Gets only currently displayed rows in window, from React Table in Bulk Edit
  getCurrentSelectedRows(rows) {
    this.currentSelectedRows = rows;
  }

  // Create MenuItems for active columns.
  getActiveFilterColumnMenu() {
    return this.state.activeCols.map((column, index) => {
      return (
        <MenuItem
          onClick={this.removeColumn(index)}
          primaryText={column.fieldName}
          key={column.fieldId}
          leftIcon={<Remove color="rgba(0,0,0,0.35)" />}
        />
      );
    });
  }

  // Create MenuItems for non-active columns.
  getNonActiveFilterColumnMenu() {
    const nonActiveCols = this.allCols.filter((column) => {
      // TODO implement best find pattern here:
      return this.state.activeCols.findIndex(item => item.fieldId === column.fieldId) === -1
    });
    return nonActiveCols.map((column, index) => {
      return (
        <MenuItem
          onClick={this.addColumn(column)}
          primaryText={column.fieldName}
          key={column.fieldId}
          leftIcon={<Add color="rgba(0,0,0,0.35)" />}
        />
      );
    });
  }

  // Toggles Column selector drawer
  toggleColumnDrawer() {
    this.setState({
      filterDrawerOpen: !this.state.filterDrawerOpen,
    });
  }

  // Add clicked column to the table
  addColumn(column) {
    return () => {
      this.setState({
        activeCols: [...this.state.activeCols, column]
      });
    };
  }

  // Add all columns to the table
  addAllColumns() {
    this.setState({
      activeCols: [...this.allCols],
    });
  }

  // Remove all columns from table
  removeAllColumns() {
    this.setState({
      activeCols: [],
    });
  }

  // Remove clicked column from table
  removeColumn(index) {
    return () => {
      const activefiltersTemp = [...this.state.activeCols];
      activefiltersTemp.splice(index, 1);
      this.setState({
        activeCols: [...activefiltersTemp],
      });
    };
  }

  // Deletes selected document from the DB, by ID
  deleteRow(id) {

  }

  // Turn schema into columnOutput, ready for React Table. Filters based on this.state.activeCols
  filteredCols(columns, isBulkEdit) {
    const { user, history } = this.props;
    const columnOutput = []

    columns.forEach((field) => {
      const isFieldActive = (this.state.activeCols.findIndex(item => item.fieldId === field.fieldId) >= 0)

      if (!isFieldActive && field.cellType !== 'bulkEditSelect' && field.cellType !== 'editButtons') {
        return;
      }

      if (field.cellType === 'editButtons' && isBulkEdit === true) {
        return;
      }

      if (field.public === false) {
        return;
      }

      const newField = {
        Header: field.fieldName,
        accessor: field.fieldId,
      };

      if (field.cellType === 'editButtons') {
        newField.filterable = false;
        newField.sortable = false;
        newField.width = 90;
        newField.resizable = false;
        newField.Cell = (row =>
          (
            <div className="centerRow">
              <Link to={`/${user.current.currentOrg}/${user.current.currentRole}/students/${row.original.id}/edit`}>
                <Edit
                  onClick={() => history.push()}
                  color="rgba(0, 0, 0, 0.30)"
                  className="pointer"
                  hoverColor="rgba(0, 0, 0, 0.60)"
                />
              </Link>
              <Link to={`/${user.current.currentOrg}/${user.current.currentRole}/students/${row.original.id}`}>
                <Visibility
                  onClick={() => history.push()}
                  color="rgba(0, 0, 0, 0.30)"
                  className="pointer"
                  hoverColor="rgba(0, 0, 0, 0.60)"
                />
              </Link>
              <Link to={`/${user.current.currentOrg}/${user.current.currentRole}/students/${row.original.id}/edit`}>
                <Clear
                  color="rgba(255, 0, 0, 0.30)"
                  className="pointer"
                  hoverColor="rgba(255, 0, 0, 0.60)"
                />
              </Link>
            </div>
          ));
      }

      if (field.cellType === 'bulkEditSelect') {
        newField.filterable = false;
        newField.sortable = false;
        newField.width = 60;
        newField.resizable = false;
        newField.Cell = (row =>
          (
            <FlatButton
              onClick={(isBulkEdit === false) ? this.selectOne(row.original, row.index) : this.deselectOne(row, row.index)}
              fullWidth
              hoverColor={(isBulkEdit === false) ? 'rgba(3, 169, 244, 0.10)' : 'rgba(255, 0, 0, 0.10)'}
              icon={<AddCircle color="rgba(0, 0, 0, 0.20)" />}
            />
          ));
      }

      if (field.cellType === 'linear-progress') {
        newField.Cell = (row => ((row.value) ? <LinearProgress mode="determinate" value={row.value} /> : ''));
      }

      if (field.cellType === 'image') {
        newField.Cell = (row => ((row.value)
          ? (
            <div className="centerRow">
              <img alt="" src={row.value} width="30px" height="30px" style={{ borderRadius: 50 }} />
            </div>
            )
          : ''));
        newField.filterable = false;
        newField.sortable = false;
      }

      if (field.cellType === 'date') {
        newField.id = field.fieldId;
        newField.accessor = (d => (
          (d[field.fieldId])
          ? timeago(String(d[field.fieldId]))
          : ''));
      }

      columnOutput.push(newField);
    });

    return columnOutput;
  }

  // Builds columns for bulk edit table, based on schema
  createBulkEditCols() {
    const newSchema = [...this.state.activeCols];

    const selectorSchemaRow = {
      fieldName:
        (
          <IconMenu
            iconButtonElement={<IconButton><MoreVert /></IconButton>}
            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          >
            <MenuItem
              primaryText="Modify Column Rows"
              leftIcon={<ViewColumn />}
              onClick={this.toggleColumnDrawer}
            />
            <MenuItem
              primaryText={(this.state.filterable) ? "Filters Off" : "Filters On"}
              leftIcon={<FilterList />}
              onClick={this.filterToggle}
            />
            <MenuItem
              leftIcon={<RemoveCircle />}
              primaryText="Clear All Bulk Edit Rows"
              onClick={this.deselectAll}
            />
            <MenuItem
              leftIcon={<Remove />}
              primaryText="Clear Only Rows On This Page"
              onClick={this.deselectAllCurrentRows}
            />
          </IconMenu>
        ),
      fieldId: '',
      cellType: 'bulkEditSelect',
    };

    const editButtons = {
      fieldName: 'Edit Row',
      fieldId: 'editButtons',
      cellType: 'editButtons',
    };

    newSchema.unshift(editButtons);
    newSchema.unshift(selectorSchemaRow);


    return this.filteredCols(newSchema, true);
  }

  // Builds columns for table based on schema
  createCols() {
    const newSchema = [...this.state.activeCols]

    // add selector Row
    const selectorSchemaRow = {
      fieldName:
        (
          <IconMenu
            iconButtonElement={<IconButton><MoreVert /></IconButton>}
            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          >
            <MenuItem
              primaryText="Modify Column Rows"
              leftIcon={<ViewColumn />}
              onClick={this.toggleColumnDrawer}
            />
            <MenuItem
              primaryText={(this.state.filterable) ? "Filters Off" : "Filters On"}
              leftIcon={<FilterList />}
              onClick={this.filterToggle}
            />
            <MenuItem
              primaryText={
                  `Add All
                  ${
                    (this.props.tableData.length)
                    ? this.props.tableData.length
                    : ''
                  }
                  Rows To Bulk Edit`
                }
              onClick={this.selectAll}
              leftIcon={<AddCircle />}
            />
            <MenuItem
              leftIcon={<Add />}
              primaryText="Add Only Rows On This Page To Bulk Edit"
              onClick={this.selectAllCurrentRows}
            />
          </IconMenu>
        ),
      fieldId: '',
      cellType: 'bulkEditSelect',
    };

    const editButtons = {
      fieldName: 'Edit',
      fieldId: 'editButtons',
      cellType: 'editButtons',
    };

    newSchema.unshift(selectorSchemaRow);
    newSchema.push(editButtons);

    return this.filteredCols(newSchema, false);
  }

  // Add all columns to Bulk Edit Area
  selectAll() {
    setTimeout((() => {
      const allSelectedIndexes = {};
      this.props.tableData.forEach((row, index) => {
        allSelectedIndexes[index] = row.id;
      });
      this.setState({
        selected: this.props.tableData,
        selectedIndexes: allSelectedIndexes,
      });
    }), 50);
    Bert.alert('All items have been added to bulk editing', 'info');
  }

  // Add columns on current Page of table to Bulk Edit area
  selectAllCurrentRows() {
    Bert.alert('All rows on this Page are being added...', 'info');
    setTimeout((() => {
      const rowsToPush = [];
      const indexesToPush = {};
      const currentRows = [...this.currentRows];
      const selected = [...this.state.selected];

      currentRows.forEach((row) => {
        for (let i = 0; i < selected.length; i += 1) {
          if (selected[i].id === row._original.id) {
            return;
          }
        }
        rowsToPush.push(row._original);
        indexesToPush[row._index] = row._original.id;
      });
      this.setState({
        selected: [...this.state.selected, ...rowsToPush],
        selectedIndexes: { ...this.state.selectedIndexes, ...indexesToPush },
      });
    }), 50);
  }

  // Add columns on current Page of table to Bulk Edit area
  deselectAllCurrentRows() {
    Bert.alert('All rows on this Page are being removed...', 'info');
    setTimeout((() => {
      const selected = [...this.state.selected];
      const selectedIndexes = { ...this.state.selectedIndexes };
      const currentRows = [...this.currentSelectedRows];
      const indexesToRemove = [];

      currentRows.forEach((row) => {
        // Get all indexes to be removed
        indexesToRemove.push(row._index);

        // Remove from selectedIndexes by Id in selectedIndexes
        const keys = Object.keys(selectedIndexes);

        for (let i = 0; i < keys.length; i += 1) {
          if (selectedIndexes[keys[i]] === row._original.id) {
            delete selectedIndexes[keys[i]];
          }
        }
      });

      // Sort indexes highest to lowest to splice in reverse order (wont screw up the array!)
      indexesToRemove.sort((a, b) => b - a);

      // Remove indexes from selected array
      for (let i = 0; i < indexesToRemove.length; i += 1) {
        selected.splice(indexesToRemove[i], 1);
      }

      this.setState({
        selected,
        selectedIndexes,
      });
    }), 50);
  }

  // deselect all from bulk edit
  deselectAll() {
    setTimeout((() => {
      this.setState({
        selected: [],
        selectedIndexes: {},
      });
    }), 50);
    Bert.alert('All items have been removed from bulk editing', 'info');
  }

  // deselect clicked item from bulk edit
  deselectOne(rowData, index) {
    return () => {
      const selected = [...this.state.selected];
      const selectedIndexes = { ...this.state.selectedIndexes };
      selected.splice(index, 1);

      const keys = Object.keys(selectedIndexes);

      for (let i = 0; i < keys.length; i += 1) {
        if (selectedIndexes[keys[i]] === rowData.id) {
          delete selectedIndexes[keys[i]];
          break;
        }
      }

      setTimeout(
        (() => this.setState({
          selected: [...selected],
          selectedIndexes,
        }))
      , 50);
    };
  }

  // select one item for bulk edit
  selectOne(rowData, index) {
    // Make sure you don't duplicate data in selected.
    return () => {
      const selected = [...this.state.selected];
      for (let i = 0; i < selected.length; i += 1) {
        if (selected[i].id === rowData.id) {
          return;
        }
      }
      const selectedIndex = { [index]: rowData.id };
      setTimeout(
        (() => this.setState({
          selected: [...this.state.selected, rowData],
          selectedIndexes: { ...this.state.selectedIndexes, ...selectedIndex },
        }))
      , 50);
    };
  }

  // turn col filters on or off
  filterToggle() {
    this.setState({
      filterable: !this.state.filterable,
    });
  }

  render() {
    // Sends current selected rows to parent on render.
    this.props.getSelected(this.state.selected);

    return (
      <div>
        <Drawer
          width={220}
          height={200}
          openSecondary
          open={this.state.filterDrawerOpen}
          containerStyle={
          {
            marginTop: '55px',
            marginBottom: '150px',
            zIndex: '1000',
            paddingTop: '20px',
          }
          }
        >
          <MenuItem
            primaryText="Done"
            rightIcon={<ChevronRight />}
            onClick={this.toggleColumnDrawer}
          />
          <MenuItem
            onClick={this.removeAllColumns}
            primaryText="Remove All"
            leftIcon={<RemoveCircle />}
          />
          <MenuItem
            onClick={this.addAllColumns}
            primaryText="Add All"
            leftIcon={<AddCircle />}
          />
          <Divider style={{ marginTop: "16px", marginBottom: "16px" }} />
          <MenuItem
            primaryText="Active Columns"
            style={{ height: 30 }}
            disabled
          />
          {this.getActiveFilterColumnMenu()}
          <Divider />
          <MenuItem
            primaryText="Non-Active Columns"
            disabled
            style={{ height: 30 }}
          />
          {this.getNonActiveFilterColumnMenu()}
          <Divider style={{ marginTop: "16px", marginBottom: "70px" }} />
        </Drawer>
        <Tabs
          style={{ width: '100%', marginBottom: "30px" }}
          inkBarStyle={{ backgroundColor: 'rgb(3, 169, 244)' }}
          tabItemContainerStyle={{
            backgroundColor: 'white',
            boxShadow: '0px 2px 0px 0px #888888',
          }}
        >
          <Tab
            label="Main Table"
            style={{ color: "black" }}
          >
            <ReactTable
              data={this.props.tableData}
              loadingText="Loading data"
              rowsText="Rows"
              ofText="of"
              pageText="Page"
              nextText="Next"
              previousText="Previous"
              noDataText={<Loading />}
              columns={this.createCols()}
              defaultPageSize={50}
              style={{
                height: "550px",
              }}
              filterable={this.state.filterable}
              className=""
              getTrProps={(state, rowInfo) => {
                const rowIndex = (rowInfo) ? rowInfo.index : null;
                const selected = !!this.state.selectedIndexes[rowIndex];
                return {
                  className: (selected) ? 'selectedRow' : '',
                };
              }}
            >
              {(state, makeTable) => (
                <div>
                  {this.getCurrentRows(state.pageRows)}
                  {makeTable()}
                </div>
              )}
            </ReactTable>
            <br />
            {(this.props.tableData.length) ? `${this.props.tableData.length} total rows` : ''}

          </Tab>
          <Tab
            label="Bulk Edits"
            style={{ color: 'black' }}
          >
            <ReactTable
              data={this.state.selected}
              loadingText="Loading data"
              rowsText="Rows"
              ofText="of"
              pageText="Page"
              nextText="Next"
              previousText="Previous"
              noDataText="Please add items to bulk edit"
              columns={this.createBulkEditCols()}
              defaultPageSize={50}
              style={{
                height: "400px",
              }}
              filterable={this.state.filterable}
              className="-striped -highlight"
            >
              {(state, makeTable) => (
                <div>
                  {this.getCurrentSelectedRows(state.pageRows)}
                  {makeTable()}
                </div>
              )}
            </ReactTable>
            <br />
            {
            (this.props.tableData.length)
            ? `${this.state.selected.length} rows selected of ${this.props.tableData.length}`
            : ''
            }
          </Tab>

        </Tabs>

        <br />
        <br />

      </div>
    );
  }
}

TableCreator.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
  schema: PropTypes.arrayOf(PropTypes.object).isRequired,
  getSelected: PropTypes.func.isRequired,
  dataType: PropTypes.objectOf(PropTypes.string),
};
