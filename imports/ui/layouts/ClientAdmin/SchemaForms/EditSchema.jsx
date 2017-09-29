import React from 'react';
import PropTypes from 'prop-types';

import NotFound from '../../../components/NotFound/NotFound';

import EditSchemaForm from '../../../components/EditSchemaForm/EditSchemaForm';

// Example schema to use for student.
// In schema creator, must have options to customize all these fields to create this form correctly.
// In Methods, uses testSchema to test against schema. Built in the form creator!
const testAllFieldsForm = {
  _id: 'schemaidgeafeageahea3a3h',
  ownerId: 'owneridggeabeafeav4a3agah4a3t',
  accountName: 'steve-test',
  readAllow: {
    admin: true,
    teacher: true,
    student: true,
    readgroup: true,
  },
  editAllow: {
    admin: true,
  },
  formCollection: 'students',
  dateUpdated: new Date().toISOString(),
  activityLogSchemaUpdates: [],
  testSchema: '', // Form must build a schema to use to test in Meteor Methods.
  // all public/editable by default.
  // Must add to React Table manually
  // non-editable schema values like
  // dateCreated/formType
  rules: {
    name: {
      string: true,
      minLength: 3,
      maxLength: 20,
    },
    description: {
      minLength: 3,
      maxLength: 250,
    },
    emailAddress1: {
      email: true,
    },
    password1: {
      password: true,
    },
    coffeeType: {},
    multipleChoice1: {},
    toggle1: {},
    slider1: {
      minValue: 0,
      maxValue: 8,
    },
    progress1: {},
    datePicker: {},
    timePicker: {},
    imageURL: {},
    videoURL: {},
  },
  messages: {
    name: {
      string: 'Invalid character types detected.',
      minLength: "Must be at least 3 characters long",
      maxLength: "Must be at most 20 characters.",
    },
    description: {
      minLength: "Must be at least 3 characters long",
      maxLength: "Must be at most 250 characters.",
    },
    emailAddress1: {
      email: "Is this email correct?",
    },
    password1: {
      password: "Keep your password safe: at least 9 characters required, at least one uppercase letter and one number. Special characters allowed: $%@#£€*?&",
    },
    coffeeType: {},
    multipleChoice1: {},
    toggle1: {},
    slider1: {
      minValue: "Must be at least 0",
      maxValue: "Cannot be more than 8",
    },
    progress1: {},
    datePicker: {},
    timePicker: {},
    imageURL: {},
    videoURL: {},
  },
  schema: [
    {
      fieldName: 'Text Field Name',
      fieldId: 'name',
      type: 'text-field',
      rules: {
        minLength: 3,
        maxLength: 20,
      },
      messages: {
        minLength: 'Must be at least 3 characters long',
        maxLength: 'Must be at most 20 characters.',
      },
      public: true,
    },
    {
      fieldName: 'Text Area Description',
      fieldId: 'description',
      type: 'text-area',
      rules: {
        minLength: 3,
        maxLength: 250,
      },
      messages: {
        minLength: 'Must be at least 3 characters long',
        maxLength: 'Must be at most 250 characters.',
      },
      public: true,
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
    // {
    //   fieldName: 'Checkbox Likes Tea',
    //   fieldId: 'likesTea',
    //   type: 'checkbox',
    //   checkBoxOptions: ['yes', 'no'],
    //   rules: {
    //     required: true,
    //   },
    //   messages: {
    //     required: 'This field is required',
    //   },
    // },
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
        fileTypes: 'File type is not accepted',
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
  ],
};

const allFieldsDoc = {
  _id: 'pDmirrbnre8xsDDCu',
  ownerId: 'gebaeaeage3a3ha3',
  formId: 'schemaidgeafeageahea3a3h',
  accountName: 'name-test',
  dateCreated: '2016-09-23',
  activityLog: [],
  formCollection: 'students',

  name: 'Dave',
  description: 'Description of a \nstudent goes here in a \ntext area field.',
  emailAddress1: 'steve@egage.com',
  relationshipStatus: 'Married',
  multiDateSelect: ['Feb 1', 'Feb 5'],
  coffeeType: 'Milk Only',
  likesTea: true,
  multipleChoice1: 0,
  toggle1: true,
  slider1: 7,
  progress1: 33,
  datePicker: new Date('2017-07-13'),
  timePicker: new Date('1505100000'),
  imageUpload1: 'http://test.com/image.png',
  imageURL: 'http://all4desktop.com/data_images/original/4244011-magic.jpg',
  fileUpload: {
    _id: 'fakeId',
    createdDate: new Date(),
    name: 'Current-File-Name.pdf',
    key: 'name-test/gea3ga3ah4a4hsh4s/Current-File-Name-id3s4srns454hsh4s4s.pdf',
    url: 'https://acad-admin.s3.amazonaws.com/name-test/gea3ga3ah4a4hsh4s/Current-File-Name-id3s4srns454hsh4s4s.pdf',
  },
  fileURL: 'http://test.com/file.pdf',
  videoURL: 'https://www.youtube.com/watch?v=1ZNZY-gd3K0',
  videoUpload: 'http://test.com/file.pdf',
};

const AddSchemaForm = ({ history, user }) => {
  return (
    <div className="EditDocument">
      <h1 className="page-header">Create New Form</h1>
      <EditSchemaForm />
    </div>
  )
}

AddSchemaForm.propTypes = {
  history: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default AddSchemaForm;
