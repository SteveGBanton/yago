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

import customFormValidator from '../../../modules/custom-form-validator';
import './EditSchemaForm.scss';
//
// const rules = {
//   "text-field": {
//     rules: {},
//     messages: {},
//   },
//   "text-area": {
//     rules: {},
//     messages: {},
//   },
// };
//
// const messages = {
//
// }

const formElements = [
  {
    type: 'text-field',
    name: 'Please enter some text:',
    fieldId: 'text-field',
    'rules.required': false,
    'rules.minLength': 0,
    'rules.maxLength': 150,
    'messages.required': 'This field is required',
    'messages.minLength': '',
    'messages.maxLength': 'Must be at most 150 characters.',
  },
  // remember, only include rules that the user will be choosing values for. Can add more important rules later on the backend.
  {
    type: 'text-area',
    name: 'Please enter some text:',
    description: '',
    fieldId: 'text-area',
    'rules.required': false,
    'rules.minLength': 0,
    'rules.maxLength': 400,
    'messages.required': 'This field is required',
    'messages.minLength': '',
    'messages.maxLength': 'Must be at most 400 characters.',
  },
  {
    type: 'email',
    name: 'Please enter your email:',
    description: '',
    fieldId: 'email',
    'rules.required': false,
    'messages.required': 'This field is required',
  },
  {
    type: 'password',
    name: 'Please choose a password:',
    description: '',
    fieldId: 'text-field-pwd',
    'rules.required': false,
    'messages.required': 'This field is required',
  },
  {
    type: 'dropdown-single-select',
    name: 'Please choose an option:',
    description: '',
    fieldId: 'dropdown-single-select',
    dropdownSingleSelectOptions: [],
    'rules.required': false,
    'messages.required': 'Please select an option',
  },
  {
    type: 'dropdown-multi-select',
    name: 'Please choose one or more:',
    description: '',
    fieldId: 'dropdown-multi-select',
    dropdownMultiSelectOptions: [],
    'rules.required': false,
    'messages.required': 'Please select at least one option',
  },
  {
    type: 'radio',
    name: 'Radio Buttons Field Name',
    description: '',
    fieldId: 'radio',
    radioOptions: [],
    'rules.required': false,
    'messages.required': 'Please select an option',
  },
  {
    type: 'multiple-choice',
    name: 'Multiple Choice Field Name',
    description: '',
    fieldId: 'multiple-choice',
    multipleChoiceWeight: 3,
    multipleChoiceOptions: ['Here is potential answer number 0', 'potential answer 1!', 'potential answer 2'],
    //multipleChoiceAnswerKeyId: '',
    'rules.required': false,
    'messages.required': 'Please choose an answer.',
  },
  {
    type: 'toggle',
    name: 'Toggle Field Name',
    description: '',
    description: '',
    fieldId: 'toggle',
    'rules.required': false,
    'messages.required': 'Please switch to on.',
  },
  {
    type: 'slider',
    name: 'Slider Field Name',
    description: '',
    fieldId: 'slider',
    sliderMax: 10,
    sliderMin: 1,
    sliderStep: 1,
    'rules.required': false,
    'messages.required': 'Please switch to on.',
    'rules.minValue': 0,
    'messages.minValue': 'Must be at least 0',
    'rules.maxValue': 8,
    'messages.maxValue': 'Must be at least 8',
  },
  {
    type: 'progress',
    name: 'Progress % Field Name',
    description: '',
    fieldId: 'progress',
    sliderMax: 100,
    sliderMin: 1,
    sliderStep: 1,
    rules: {},
    messages: {},
  },
  {
    type: 'date-picker',
    name: 'Date Picker Field Name',
    description: '',
    fieldId: 'date-picker',
    maxDate: (new Date().getDate + 5),
    minDate: (new Date().getDate - 5),
    // locale: 'en-US',
    'rules.required': false,
    'messages.required': 'Please choose a date.',
  },
  {
    type: 'time-picker',
    name: 'Time Picker Field Name',
    description: '',
    fieldId: 'time-picker',
    // format: 'ampm',
    // locale: 'en-US',
    'rules.required': false,
    'messages.required': 'Please switch to on.',
  },
  // {
  //   type: 'image-upload',
  //   name: 'Image Upload Field Name',
  //   fieldId: 'image-upload',
  //   imageMaxDimensions: {
  //     height: 500,
  //     width: 500,
  //   },
  //   imageMinDimensions: {
  //     height: 100,
  //     width: 100,
  //   },
  //   imageSize: 1000,
  //   'rules.required': false,
  //   'messages.required': 'Please upload a valid image.',
  // },
  {
    type: 'image-url',
    name: 'Image URL Field Name',
    description: '',
    fieldId: 'image-url',
    'rules.required': false,
    'messages.required': 'A valid image is required.',
  },
  {
    type: 'file-upload',
    name: 'File Upload Field Name',
    description: '',
    fieldId: 'file-upload',
    'rules.required': false,
    'messages.required': 'Please upload a file.',
    'rules.fileSize': 20000,
    'messages.fileSize': 'Sorry, file is too big.',
    'rules.fileTypes': ['pdf', 'xls', 'xlsx', 'doc', 'docx', 'mp4', 'mov', 'png', 'jpg', 'jpeg', 'gif'],
    'messages.fileTypes': 'Sorry, filetype not allowed.',
  },
  {
    type: 'file-url',
    name: 'File URL Field Name',
    description: '',
    fieldId: 'file-url',
    'rules.required': false,
    'messages.required': 'Please add a file.',
  },
  {
    type: 'video-url',
    name: 'Video URL Field Name',
    description: '',
    fieldId: 'video-url',
    'rules.required': false,
    'messages.required': 'A valid video is required.',
  },
];






const exampleFormBuild = {
  readAllow: ['admin', 'teacher', 'student', 'ga3a4stbr5d5y3hsh'],
  editAllow: ['admin'],
  rules: {
    "field-id1": {
      required: true,
      minLength: 3,
      maxLength: 20,
    }
  },
  messages: {
    "field-id1": {
      minLength: 'Must be at least 3 characters long',
      maxLength: 'Must be at most 20 characters.',
    }
  },
  schema: [
    {
      fieldName: 'New Field Name',
      fieldId: 'text-field-tea3',
      type: 'text-field',
    },
    {
      fieldName: 'Text Area Description',
      type: 'text-area',
      fieldId: 'text-area-g3ag4a',
      rules: {
        minLength: 3,
        maxLength: 250,
      },
      messages: {
        minLength: 'Must be at least 3 characters long',
        maxLength: 'Must be at most 250 characters.',
      },
    },
    {
      fieldName: 'Email Address',
      fieldId: 'emailAddress1',
      type: 'text-field',
      rules: {
        email: true,
      },
      messages: {
        email: 'Is this email correct?',
      },
      public: true,
    },
    {
      fieldName: 'Password',
      fieldId: 'password1',
      type: 'text-field',
      rules: {
        password: true,
      },
      messages: {
        password: "Keep your password safe: at least 9 characters required, at least one uppercase letter and one number. Special characters allowed: $%@#£€*?&",
      },
      public: true,
    },
    {
      fieldName: 'Relationship singleselect',
      fieldId: 'relationshipStatus',
      type: 'dropdown-single-select',
      dropdownSingleSelectOptions: ['Rather Not Say', 'Married', 'Single', 'It\'s complicated'],
      rules: {},
      messages: {},
    },
    {
      fieldName: 'Date Select multiselect',
      fieldId: 'multiDateSelect',
      type: 'dropdown-multi-select',
      dropdownMultiSelectOptions: ['Feb 1', 'Feb 5', 'Feb 9', 'Feb 22'],
      rules: {},
      messages: {},
    },
    {
      fieldName: 'Radio How Takes Coffee',
      fieldId: 'coffeeType',
      type: 'radio',
      radioOptions: ['Black', 'Double Double', 'Cream and Sugar', 'Milk and Sugar', 'Milk Only', 'Sugar Only'],
      rules: {},
      messages: {},
    },
    {
      fieldName: 'multiple choice Is coffee better than tea?',
      fieldId: 'multipleChoice1',
      type: 'multiple-choice',
      multipleChoiceWeight: 3,
      multipleChoiceOptions: ['Here is potential answer number 0', 'potential answer 1!', 'potential answer 2'],
      multipleChoiceAnswerKeyId: 'idofformageaben4w4hwsgsg',
      rules: {},
      messages: {},
    },
    {
      fieldName: 'Toggle On Off',
      fieldId: 'toggle1',
      type: 'toggle',
      rules: {},
      messages: {},
    },
    {
      fieldName: 'Coffees Per Day Slider',
      fieldId: 'slider1',
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
      fieldName: 'Progress Percentage',
      fieldId: 'progress1',
      type: 'progress',
      sliderMax: 100,
      sliderMin: 1,
      sliderStep: 1,
      rules: {},
      messages: {},
    },
    {
      fieldName: 'Date Picker Date of Appointment',
      fieldId: 'datePicker',
      type: 'date-picker',
      maxDate: (new Date().getDate + 5),
      minDate: (new Date().getDate - 5),
      locale: 'en-US',
      rules: {},
      messages: {},
    },
    {
      fieldName: 'Time Picker',
      fieldId: 'timePicker',
      type: 'time-picker',
      format: 'ampm',
      locale: 'en-US',
      rules: {},
      messages: {},
    },
    {
      fieldName: 'Image Upload',
      fieldId: 'imageUpload1',
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
      rules: {},
      messages: {},
    },
    {
      fieldName: 'Add Image URL',
      fieldId: 'imageURL',
      type: 'image-url',
      rules: {},
      messages: {},
    },
    {
      fieldName: 'File Upload',
      fieldId: 'fileUpload',
      type: 'file-upload',
      rules: {
        fileSize: 1000,
        fileTypes: ['pdf', 'xls'],
      },
      messages: {
        fileSize: 'File is too large',
        fileTypes: 'File type is not accepted'
      },
    },
    {
      fieldName: 'File URL',
      fieldId: 'fileURL',
      type: 'file-url',
      rules: {},
      messages: {},
    },
    {
      fieldName: 'Video URL',
      fieldId: 'videoURL',
      type: 'video-url',
      rules: {},
      messages: {},
    },
    {
      fieldName: 'Video Upload',
      fieldId: 'videoUpload',
      type: 'video-upload',
      rules: {},
      messages: {},
    },
  ]
}


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
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFieldToggle = this.handleFieldToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formValidate = this.formValidate.bind(this);

    this.state = {
      activeDialog: 0,
      droppable: formElements,
      added: [],
      dialogOpen: false,
      dialogContent: [(<div></div>)],
      formErrors: {
        1: {
          "name": 'Field is required',
        },
        2: {
          "name": 'Field is required',
        }
      },
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
      // Reorder list, droppig in the same source.

      const items = reorder(
        this.state[result.source.droppableId],
        result.source.index,
        result.destination.index,
      );

      this.setState({
        [result.source.droppableId]: [...items],
        formErrors: {},
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
        newItem.fieldId = `${newItem.fieldId}-${Random.id(9)}`;
        addedResult.splice(result.destination.index, 0, newItem);
        return {
          removedResult,
          addedResult,
        };
      };

      this.setState({
        [result.destination.droppableId]: [...getNewLists().addedResult],
        formErrors: {},
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
        formErrors: {},
      });
    }
  }

  deleteOne(index) {
    return () => {
      const withDeletedIndex = [...this.state.added];
      withDeletedIndex.splice(index, 1);
      this.setState({
        added: [...withDeletedIndex],
      });
    };
  }

  duplicateOne(index) {
    return () => {
      const original = [...this.state.added];
      const newField = { ...original[index]
      };
      newField.fieldId = `${original[index].type}-${Random.id(9)}`;
      original.splice(index, 0, newField);
      this.setState({
        added: [...original],
      });
    };
  }

  removeAll() {
    this.setState({
      added: [],
    });
  }

  openDialog() {
    this.setState({
      dialogOpen: true,
    });
  }

  dialogContent(index) {
    const form = [];

    const itemToEdit = (this.state.added[index]) ? { ...this.state.added[index]
    } : {};


    // const allFields = [
    //   ...Object.keys(itemToEdit),
    // ];

    const allFields = [
      'type',
      'name',
      'description',
      'fieldId',
      'rules.required',
      'rules.minLength',
      'rules.maxLength',
      'messages.required',
      'messages.minLength',
      'messages.maxLength',
    ]

    allFields.forEach((field) => {

      if (Object.prototype.hasOwnProperty.call(itemToEdit, field) && field === 'type') {
        const temp =
          (
            <div key={`${field}-h4s4s`}>
              <Chip>
                {itemToEdit[field]}
              </Chip>
            </div>
          );
        form.push(temp);
      }

      if (Object.prototype.hasOwnProperty.call(itemToEdit, field) && field === 'name') {
        const temp =
          (
            <div key={`${field}-h4s4s`}>
              <TextField
                value={this.state.added[index].name}
                floatingLabelText="Field Label"
                onChange={e => this.handleFieldChange(e, index, field)}
                errorText={(this.state.formErrors[index] && this.state.formErrors[index][field]) ? this.state.formErrors[index][field] : ''}
              />
            </div>
          );
        form.push(temp);
      }

      if (Object.prototype.hasOwnProperty.call(itemToEdit, field) && field === 'rules.required') {
        const temp =
          (
            <div key={`${field}-h4s4s`}>
              <Chip style={{ marginRight: 5 }}>
                {field.type}
              </Chip>
            </div>
          );
        form.push(temp);
      }



    });

    return form;
  }

  handleFieldToggle(index, field) {
    const toUpdate = [...this.state.added];
    toUpdate[index][field] = !toUpdate[index][field]

    this.setState({
      added: [...toUpdate],
    });
  }

  handleFieldChange(e, index, field) {
    const toUpdate = [...this.state.added];
    toUpdate[index][field] = e.target.value;

    this.setState({
      added: [...toUpdate],
    });
  }

  editInDialog(index) {
    return () => {
      // Set Active Dialog

      this.setState({
        activeDialog: index,
      });

      this.openDialog();
    };
    // Set Action Buttons
  }

  handleClose() {
    this.setState({
      dialogOpen: false,
    });
  }

  formValidate() {
    this.setState({
      formErrors: {},
    });

    const schemaRules = {
      name: {
        required: true,
      },
    };

    const schemaMessages = {
      name: {
        required: 'This field is required',
      },
    };

    // Validate
    const rawFields = [...this.state.added]
    const formErrors = {};

    rawFields.forEach((field, index) => {

      const formErrorsOne = customFormValidator(field, schemaRules, schemaMessages);
      if (formErrorsOne) {
        formErrors[index] = formErrorsOne;
      }
    })

    if (Object.keys(formErrors).length > 0) {
      this.setState({
        formErrors,
      })
    } else {
      this.setState({
        formErrors
      })
      this.handleSubmit(rawFields);
    }



  }

  handleSubmit(rawFields) {

    this.setState({})

    // No validation errors, Build output & submit to DB
    const input = {};
    const schema = [];
    const rules = {};
    const messages = {};

    rawFields.forEach((field) => {

      // Build rules and messages from flat array
      const rulesOne = {};
      const messagesOne = {};

      if (field["rules.required"]) rulesOne.required = field["rules.required"];
      if (field["rules.minLength"]) rulesOne.minLength = field["rules.minLength"];
      if (field["rules.maxLength"]) rulesOne.maxLength = field["rules.maxLength"];
      if (field["rules.email"]) rulesOne.email = field["rules.email"];
      if (field["rules.password"]) rulesOne.password = field["rules.password"];
      if (field["rules.minValue"]) rulesOne.minValue = field["rules.minValue"];
      if (field["rules.maxValue"]) rulesOne.maxValue = field["rules.maxValue"];
      if (field["rules.fileSize"]) rulesOne.fileSize = field["rules.fileSize"];
      if (field["rules.fileTypes"]) rulesOne.fileTypes = field["rules.fileTypes"];

      if (field["messages.required"]) messagesOne.required = field["messages.required"];
      if (field["messages.minLength"]) messagesOne.minLength = field["messages.minLength"];
      if (field["messages.maxLength"]) messagesOne.maxLength = field["messages.maxLength"];
      if (field["messages.email"]) messagesOne.email = field["messages.email"];
      if (field["messages.password"]) messagesOne.password = field["messages.password"];
      if (field["messages.minValue"]) messagesOne.minValue = field["messages.minValue"];
      if (field["messages.maxValue"]) messagesOne.maxValue = field["messages.maxValue"];
      if (field["messages.fileSize"]) messagesOne.fileSize = field["messages.fileSize"];
      if (field["messages.fileTypes"]) messagesOne.fileTypes = field["messages.fileTypes"];

      const schemaOne = {
        fieldName: field.name,
        type: field.type,
        fieldId: field.fieldId,
      };

      rules[field.fieldId] = rulesOne;
      messages[field.fieldId] = messagesOne;
      schema.push(schemaOne);
    });

    input.schema = schema;
    input.rules = rules;
    input.messages = messages;

    console.log(rawFields);
    console.log(input);
  }

  render() {
    console.log(this.state.formErrors)
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <RaisedButton
          onClick={this.removeAll}
          style={{ margin: 5, paddingLeft: 8, paddingRight: 8 }}
        >
          Reset Form
        </RaisedButton>
        <RaisedButton
          onClick={this.formValidate}
          style={{ margin: 5, paddingLeft: 8, paddingRight: 8 }}
        >
          Submit Form
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
                                style={{ marginLeft: 5 }}
                                color="rgba(0,0,0,0.2)"
                              >
                                drag_handle
                              </FontIcon>
                            </span>
                            <span>
                              <Chip style={{ marginRight: 5 }}>
                                {item.type}
                              </Chip>
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
                                <Chip style={{ marginRight: 5 }}>
                                  {item.type}
                                </Chip>
                              </div>
                              {(this.state.formErrors[index]) ?
                                <Chip
                                  style={{
                                    fontSize: 10, backgroundColor: 'red',
                                  }}
                                >
                                  errors
                                </Chip> : ''}
                              <div className="titleBoxButton">
                                <FontIcon
                                  onClick={this.editInDialog(index)}
                                  className="material-icons pointer"
                                  color="rgba(0,0,0,0.2)"
                                  hoverColor="rgba(0,0,0,0.5)"
                                >
                                  edit
                                </FontIcon>
                              </div>
                              <div className="titleBoxButton">
                                <FontIcon
                                  onClick={this.deleteOne(index)}
                                  className="material-icons pointer"
                                  color="rgba(0,0,0,0.2)"
                                  hoverColor="rgba(0,0,0,0.5)"
                                >
                                  remove_circle
                                </FontIcon>
                              </div>
                              <div className="titleBoxButton">
                                <FontIcon
                                  onClick={this.duplicateOne(index)}
                                  className="material-icons pointer"
                                  color="rgba(0,0,0,0.2)"
                                  hoverColor="rgba(0,0,0,0.5)"
                                >
                                  content_copy
                                </FontIcon>
                              </div>
                            </div>
                            <div className="chipBox" />

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
