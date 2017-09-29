import React from 'react';
import PropTypes from 'prop-types';
import {
  Random,
} from 'meteor/random';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';

import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import RemoveCircle from 'material-ui/svg-icons/content/remove-circle';
import Chip from 'material-ui/Chip';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import {blue300, indigo900} from 'material-ui/styles/colors';

import './EditSchemaForm.scss';

const formElements = [
  {
    name: 'Text Field',
    fieldId: 'text-field',
    type: 'text-field',
    'rules.required': false,
    'rules.minLength': 0,
    'rules.maxLength': 150,
    'messages.required': 'This field is required',
    'messages.minLength': '',
    'messages.maxLength': 'Must be at most 150 characters.',
  },
  {
    name: 'Text Area',
    fieldId: 'text-area',
    type: 'text-area',
    rules: {
      required: false,
      minLength: 0,
      maxLength: 400,
    },
    messages: {
      required: 'This field is required',
      minLength: '',
      maxLength: 'Must be at most 400 characters.',
    },
  },
  {
    name: 'Email Address',
    fieldId: 'email',
    type: 'email',
    rules: {
      required: false,
      minLength: 0,
      maxLength: 150,
    },
    messages: {
      required: 'This field is required',
      minLength: 'Must be at least 0 characters long',
      maxLength: 'Must be at most 150 characters.',
    }
  },
  {
    name: 'Password',
    fieldId: 'text-field-pwd',
    type: 'password',
    rules: {
      required: false,
    },
    messages: {
      required: 'This field is required',
    }
  },
  {
    name: 'Dropdown Single Select',
    fieldId: 'dropdown-single-select',
    type: 'dropdown-single-select',
    dropdownSingleSelectOptions: [],
    rules: {
      required: false,
    },
    messages: {
      required: 'This field is required',
    }
  },
  {
    name: 'Dropdown Multi Select',
    fieldId: 'dropdown-multi-select',
    type: 'dropdown-multi-select',
    dropdownMultiSelectOptions: [],
    rules: {
      required: false,
    },
    messages: {
      required: 'This field is required',
    }
  },
  {
    name: 'Radio Buttons',
    fieldId: 'radio',
    type: 'radio',
    radioOptions: [],
    rules: {
      required: false,
    },
    messages: {
      required: 'This field is required',
    }
  },
  {
    name: 'Multiple Choice',
    fieldId: 'multiple-choice',
    type: 'multiple-choice',
    multipleChoiceWeight: 3,
    multipleChoiceOptions: ['Here is potential answer number 0', 'potential answer 1!', 'potential answer 2'],
    multipleChoiceAnswerKeyId: 'idofformageaben4w4hwsgsg',
    rules: {
      required: false,
    },
    messages: {
      required: 'This field is required',
    }
  },
  {
    name: 'Toggle',
    fieldId: 'toggle',
    type: 'toggle',
    rules: {
      required: false,
    },
    messages: {
      required: 'This field is required',
    },
  },
  {
    name: 'Slider',
    fieldId: 'slider',
    type: 'slider',
    sliderMax: 10,
    sliderMin: 1,
    sliderStep: 1,
    rules: {
      minValue: 0,
      maxValue: 8,
    },
    messages: {
      minValue: 'Must be at least 0',
      maxValue: 'Cannot be more than 8',
    },
  },
  {
    name: 'Progress %',
    fieldId: 'progress',
    type: 'progress',
    sliderMax: 100,
    sliderMin: 1,
    sliderStep: 1,
    rules: {},
    messages: {},
  },
  {
    name: 'Date Picker',
    fieldId: 'date-picker',
    type: 'date-picker',
    maxDate: (new Date().getDate + 5),
    minDate: (new Date().getDate - 5),
    locale: 'en-US',
    rules: {
      required: false,
    },
    messages: {
      required: 'This field is required',
    },
  },
  {
    name: 'Time Picker',
    fieldId: 'time-picker',
    type: 'time-picker',
    format: 'ampm',
    locale: 'en-US',
    rules: {
      required: false,
    },
    messages: {
      required: 'This field is required',
    },
  },
  {
    name: 'Image Upload',
    fieldId: 'image-upload',
    type: 'image-upload',
    imageMaxDimensions: {
      height: 500,
      width: 500,
    },
    imageMinDimensions: {
      height: 100,
      width: 100,
    },
    imageSize: 1000,
    rules: {
      required: false,
    },
    messages: {
      required: 'This field is required',
    },
  },
  {
    name: 'Image URL',
    fieldId: 'image-url',
    type: 'image-url',
    rules: {
      required: false,
    },
    messages: {
      required: 'This field is required',
    },
  },
  {
    name: 'File Upload',
    fieldId: 'file-upload',
    type: 'file-upload',
    rules: {
      required: false,
      fileSize: 1000,
      fileTypes: ['pdf', 'xls'],
    },
    messages: {
      required: 'This field is required',
      fileSize: 'File is too large',
      fileTypes: 'File type is not accepted',
    },
  },
  {
    name: 'File URL',
    fieldId: 'file-url',
    type: 'file-url',
    rules: {
      required: false,
    },
    messages: {
      required: 'This field is required',
    },
  },
  {
    name: 'Video URL',
    fieldId: 'video-url',
    type: 'video-url',
    rules: {
      required: false,
    },
    messages: {
      required: 'This field is required',
    },
  },
];

// help with reordering
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// inline style helpers
const getItemStyle = (draggableStyle, isDragging) => ({
  // some basic styles to make the items look a bit nicer
  margin: 6,
  padding: 12,
  // change background colour if dragging
  background: isDragging ? 'lightgreen' : '#f4f4f4',
  // styles we need to apply on draggables
  ...draggableStyle,
});

export default class EditSchemaForm extends React.Component {

  constructor(props) {
    super(props);
    this.deleteOne = this.deleteOne.bind(this);
    this.removeAll = this.removeAll.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.dialogContent = this.dialogContent.bind(this);
    this.editInDialog = this.editInDialog.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this)

    this.state = {
      activeDialog: 0,
      droppable: formElements,
      added: [],
      dialogOpen: false,
      dialogContent: [(<div></div>)],
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentWillMount() {

  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    console.log(result);

    if (result.source.droppableId === result.destination.droppableId) {
      // reorder the same source.

      const items = reorder(
        this.state[result.source.droppableId],
        result.source.index,
        result.destination.index,
      );

      this.setState({
        [result.source.droppableId]: [...items],
      });
    } else if (result.destination.droppableId === 'added') {
      // Added to 'added'. Don't remove from sidebar.

      const getNewLists = () => {
        const removedResult = [...this.state[result.source.droppableId]];
        const addedResult = [...this.state[result.destination.droppableId]];

        const [removedItem] = removedResult.splice(result.source.index, 1);
        const newItem = {
          ...removedItem,
        };
        newItem.fieldId = `${newItem.fieldId}-${Random.id(7)}`;
        addedResult.splice(result.destination.index, 0, newItem);
        return {
          removedResult,
          addedResult,
        };
      };

      this.setState({
        [result.destination.droppableId]: [...getNewLists().addedResult],
      });
    } else if (result.source.droppableId === 'added') {

      // Cannot drag from added right now, no change.

    } else {
      const getNewLists = () => {
        const removedResult = [...this.state[result.source.droppableId]];
        const addedResult = [...this.state[result.destination.droppableId]];

        const [removedItem] = removedResult.splice(result.source.index, 1);
        addedResult.splice(result.destination.index, 0, removedItem);
        return {
          removedResult,
          addedResult,
        };
      };

      this.setState({
        [result.source.droppableId]: [...getNewLists().removedResult],
        [result.destination.droppableId]: [...getNewLists().addedResult],
      });
    }
  }

  deleteOne(index) {
    return () => {
      const withDeletedIndex = [...this.state.added];
      withDeletedIndex.splice(index, 1);
      this.setState({
        added: [...withDeletedIndex],
      })
    }
  }

  duplicateOne(index) {
    return () => {
      const original = [...this.state.added];
      const newField = { ...original[index] };
      newField.fieldId = `${original[index].fieldId}-c${Random.id(3)}`;
      original.splice(index, 0, newField);
      this.setState({
        added: [...original],
      });
    }
  }

  removeAll() {
    this.setState({
      added: [],
    })
  }

  openDialog() {
    this.setState({
      dialogOpen: true,
    })
  }

  dialogContent(index) {
      // name: 'Text Field',
      // fieldId: 'text-field',
      // type: 'text-field',
      // 'rules.required': false,
      // 'rules.minLength': 0,
      // 'rules.maxLength': 150,
      // 'messages.required': 'This field is required',
      // 'messages.minLength': '',
      // 'messages.maxLength': 'Must be at most 150 characters.',

      // name, rules.required, rules.maxLength, rules.minLength

      const form = [];

      const itemToEdit = (this.state.added[index]) ? { ...this.state.added[index] } : {};

      const allFields = [
        ...Object.keys(itemToEdit),
      ];

      allFields.forEach((field) => {
        if (field === 'name') {
          const temp =
          (
            <div key={`${field}-h4s4s`}>
              <TextField
                value={this.state.added[index].name}
                floatingLabelText="Field Name"
                onChange={e => this.handleFieldChange(e, index, field)}
              />
            </div>
          )
          form.push(temp)
        }
      });

      return form
  }

  handleFieldChange(e, index, field) {
    const toUpdate = [...this.state.added];
    toUpdate[index][field] = e.target.value;

    this.setState({
      added: [...toUpdate],
    }, () => {
      console.log(this.state.added)
    });
  }

  editInDialog(index) {
    return () => {
      // Set Active Dialog

      this.setState({
        activeDialog: index,
      })

      this.openDialog();

    }
    // Set Action Buttons


  }

  getChips(index) {
    return () => {

    }
  }

  handleClose() {
    this.setState({
      dialogOpen: false,
    })
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <RaisedButton
          onClick={this.removeAll}
          style={{ margin: 5, paddingLeft: 8, paddingRight: 8 }}
        >
          Reset Form
        </RaisedButton>
        <div className="edit-schema-form grab-cursor">
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                className="outerDroppableContainer"
              >
                <Paper className="tableComponentsList">
                  {this.state.droppable.map(item => (
                    <Draggable key={item.fieldId} draggableId={item.fieldId}>
                      {(provided, snapshot) => (
                        <div>
                          <div
                            ref={provided.innerRef}
                            style={getItemStyle(
                                provided.draggableStyle,
                                snapshot.isDragging,
                              )}
                            className="draggableComponents"
                            {...provided.dragHandleProps}
                          >
                            <span>
                              <FontIcon
                                className="material-icons"
                                style={{ marginRight: 5 }}
                                color="rgba(0,0,0,0.2)"
                              >
                                drag_handle
                              </FontIcon>
                            </span>
                            <span>
                              {item.name}
                            </span>
                          </div>
                          {provided.placeholder}
                        </div>
                        )}
                    </Draggable>
                    ))}
                  {provided.placeholder}
                </Paper>
              </div>
              )}
          </Droppable>
          <Droppable droppableId="added">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                className="innerDroppableContainer"
              >
                <Paper className={(snapshot.isDraggingOver) ? "innerDroppable-hover" : "innerDroppable"}>
                {this.state.added.map((item, index) => (
                  <Draggable key={item.fieldId} draggableId={item.fieldId}>
                    {(provided, snapshot) => (
                      <div>
                        <div
                          ref={provided.innerRef}
                          style={getItemStyle(
                              provided.draggableStyle,
                              snapshot.isDragging,
                            )}
                          className="droppedComponents"
                          {...provided.dragHandleProps}
                        >
                          <div className="titleBox">
                            <div className="titleBoxLeft">
                              <FontIcon
                                className="material-icons"
                                color="rgba(0,0,0,0.2)"
                                style={{ marginRight: 5 }}
                              >
                                drag_handle
                              </FontIcon>
                                {item.name}
                            </div>
                            <div className="titleBoxButton">
                              {<FontIcon
                                onClick={this.deleteOne(index)}
                                className="material-icons"
                              />}
                            </div>
                            <div className="titleBoxButton">
                              {
                                <FontIcon
                                  onClick={this.editInDialog(index)}
                                  className="material-icons pointer"
                                  color="rgba(0,0,0,0.2)"
                                  hoverColor="rgba(0,0,0,0.5)"
                                >
                                  edit
                                </FontIcon>
                              }
                            </div>
                            <div className="titleBoxButton">
                              {
                                <FontIcon
                                  onClick={this.deleteOne(index)}
                                  className="material-icons pointer"
                                  color="rgba(0,0,0,0.2)"
                                  hoverColor="rgba(0,0,0,0.5)"
                                >
                                  remove_circle
                                </FontIcon>
                              }
                            </div>
                            <div className="titleBoxButton">
                              {
                                <FontIcon
                                  onClick={this.duplicateOne(index)}
                                  className="material-icons pointer"
                                  color="rgba(0,0,0,0.2)"
                                  hoverColor="rgba(0,0,0,0.5)"
                                >
                                  content_copy
                                </FontIcon>
                              }
                            </div>


                          </div>
                          <div className="chipBox">

                          </div>

                        </div>
                        {provided.placeholder}
                      </div>
                      )}
                  </Draggable>
                  ))}
                {provided.placeholder}
              </Paper>
              </div>
              )}
          </Droppable>
        </div>
        <Dialog
          title="Edit Form Field"
          actions={[
            <FlatButton
              label="Close"
              primary
              onClick={this.handleClose}
            />,
          ]}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.handleClose}
        >
          {this.dialogContent(this.state.activeDialog).map(key => key)}
        </Dialog>
      </DragDropContext>

    );
  }
}

EditSchemaForm.defaultProps = {
  form: {},
};

EditSchemaForm.propTypes = {
  form: PropTypes.object,
};
