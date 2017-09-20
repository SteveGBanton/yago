import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Random } from 'meteor/random'
import { Meteor } from 'meteor/meteor';

import EditForm from '../../../../components/EditForm/EditForm';
import NotFound from '../../../../components/NotFound/NotFound';

// Example schema to use for student.
// In schema creator, must have options to customize all these fields to create this form correctly.
// In Methods, uses testSchema to test against schema. Built in the form creator!
const testAllFieldsForm = {
  id: 'schemaidgeafeageahea3a3h',
  ownerId: 'owneridggeabeafeav4a3agah4a3t',
  accountName: 'name-test',
  readAllow: ["admin", "teacher", "readgroup"],
  editAllow: ["admin", "teacher"],
  formType: 'student',
  dateUpdated: new Date().toISOString(),
  activityLogSchemaUpdates: [],
  testSchema: '', // Form must build a schema to use to test in Meteor Methods.
  // all public/editable by default.
  // Must add to React Table manually
  // non-editable schema values like
  // dateCreated/formType
  schema: [
    {
      fieldName: 'Text Field Name',
      fieldId: 'name',
      type: 'text-field',
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin", "teacher"],
      rules: {
        minLength: 3,
        maxLength: 20,
        required: 'true',
      },
      messages: {
        minLength: 'Must be at least 3 characters long',
        maxLength: 'Must be at most 20 characters.',
        required: 'This field is required',
      },
      public: true,
    },
    {
      fieldName: 'Text Area Description',
      fieldId: 'description',
      type: 'text-area',
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin", "teacher"],
      rules: {
        minLength: 20,
        maxLength: 250,
        required: true,
      },
      messages: {
        minLength: 'Must be at least 3 characters long',
        maxLength: 'Must be at most 20 characters.',
        required: 'This field is required',
      },
      public: true,
    },
    {
      fieldName: 'Email Address',
      fieldId: 'emailAddress1',
      type: 'text-field',
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin"],
      rules: {
        email: true,
        required: true,
      },
      messages: {
        email: 'Is this email correct?',
        required: 'This field is required',
      },
      public: true,
    },
    {
      fieldName: 'Password',
      fieldId: 'password1',
      type: 'text-field',
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin"],
      rules: {
        password: true,
      },
      messages: {
        password: "Keep your password safe: at least 9 characters required, at least one uppercase letter and one number. Special characters allowed: $%@#£€*?&",
      },
      public: true,
    },
    {
      fieldName: 'dropdown-single-select Relationship',
      fieldId: 'relationshipStatus',
      type: 'dropdown-single-select',
      dropdownSingleSelectOptions: ['Rather Not Say', 'Married', 'Single', 'It\'s complicated'],
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin", "teacher"],
      rules: {
        required: true,
      },
      messages: {
        required: 'This field is required',
      },
      public: true,
    },
    {
      fieldName: 'dropdown-multi-select Date Select',
      fieldId: 'multiDateSelect',
      type: 'dropdown-multi-select',
      dropdownMultiSelectOptions: ['Feb 1', 'Feb 5', 'Feb 9', 'Feb 22'],
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin", "teacher"],
      rules: {
        required: true,
      },
      messages: {
        required: 'This field is required',
      },
    },
    {
      fieldName: 'Radio How Takes Coffee',
      fieldId: 'coffeeType',
      type: 'radio',
      radioOptions: ['Black', 'Double Double', 'Cream and Sugar', 'Milk and Sugar', 'Milk Only', 'Sugar Only'],
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin", "teacher"],
      rules: {
        required: true,
      },
      messages: {
        required: 'This field is required',
      },
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
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin", "teacher"],
      rules: {
        required: true,
      },
      messages: {
        required: 'This field is required',
      },
    },
    {
      fieldName: 'Toggle On Off',
      fieldId: 'toggle1',
      type: 'toggle',
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin", "teacher"],
      rules: {
        required: true,
      },
      messages: {
        required: 'You must set this to true',
      },
    },
    {
      fieldName: 'Coffees Per Day Slider',
      fieldId: 'slider1',
      type: 'slider',
      sliderMax: 10,
      sliderMin: 1,
      sliderStep: 1,
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin", "teacher"],
      rules: {
        required: true,
        minValue: 4,
        maxValue: 8,
      },
      messages: {
        required: 'This field is required',
        minValue: 'Must be at least 4',
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
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin", "teacher"],
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
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin", "teacher"],
      rules: {
        required: true,
      },
      messages: {
        required: 'This field is required',
      },
    },
    {
      fieldName: 'Time Picker',
      fieldId: 'timePicker',
      type: 'time-picker',
      format: 'ampm',
      locale: 'en-US',
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin", "teacher"],
      rules: {
        required: true,
      },
      messages: {
        required: 'This field is required',
      },
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
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin", "teacher"],
      rules: {
        required: true,
      },
      messages: {
        required: 'This field is required',
      },
    },
    {
      fieldName: 'Add Image URL',
      fieldId: 'imageURL',
      type: 'image-url',
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin", "teacher"],
      rules: {
        required: true,
      },
      messages: {
        required: 'A valid image is required',
      },
    },
    {
      fieldName: 'File Upload',
      fieldId: 'fileUpload',
      type: 'file-upload',
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin", "teacher"],
      rules: {
        required: true,
        fileSize: 1000,
        fileTypes: ['pdf', 'xls'],
      },
      messages: {
        required: 'This field is required',
        fileSize: 'File is too large',
        fileTypes: 'File type is not accepted'
      },
    },
    {
      fieldName: 'File URL',
      fieldId: 'fileURL',
      type: 'file-url',
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin", "teacher"],
      rules: {
        required: true,
      },
      messages: {
        required: 'This field is required',
      },
    },
    {
      fieldName: 'Video URL',
      fieldId: 'videoURL',
      type: 'video-url',
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin", "teacher"],
      rules: {
        required: true,
      },
      messages: {
        required: 'Valid video URL required',
      },
    },
    {
      fieldName: 'Video Upload',
      fieldId: 'videoUpload',
      type: 'video-upload',
      readAllow: ["admin", "teacher", "readgroup"],
      editAllow: ["admin", "teacher"],
      rules: {
        required: true,
      },
      messages: {
        required: 'This field is required',
      },
    },
  ],
};

const allFieldsDoc = {
  id: Random.id(),
  ownerId: 'gebaeaeage3a3ha3',
  formId: 'schemaidgeafeageahea3a3h',
  accountName: 'name-test',
  dateCreated: '2016-09-23',
  activityLog: [],
  formType: 'student',

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
    createdDate: new Date(),
    name: 'Current-File-Name.pdf',
    key: '/name-test/gea3ga3ah4a4hsh4s/Current-File-Name-id3s4srns454hsh4s4s.pdf',
  },
  fileURL: 'http://test.com/file.pdf',
  videoURL: 'https://www.youtube.com/watch?v=1ZNZY-gd3K0',
  videoUpload: 'http://test.com/file.pdf',
}

const getSchema = function getSchema(id) {
  // get the form from db based on doc.formid
}

const EditStudent = ({ doc, history, user, form }) => (doc && form ? (
  <div className="EditDocument">
    <h1 className="page-header">{`Editing Student "${doc.name}"`}</h1>
    <EditForm doc={doc} history={history} user={user} form={form} />
  </div>
) : <NotFound />);

EditStudent.defaultProps = {
  doc: null,
};

EditStudent.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const documentId = match.params.id;
  const subscription = Meteor.subscribe('documents.view', documentId);
  // const doc = Documents.findOne(documentId),
  // const formId = doc.formId; // Find schema to use from doc form.
  // const form = Forms.findOne(formId);

  return {
    loading: !subscription.ready(),
    doc: allFieldsDoc,
    form: testAllFieldsForm,
  };
}, EditStudent);
