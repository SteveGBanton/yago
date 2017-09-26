import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import AWS from 'aws-sdk';
import Students from '../Students';
// import Forms from '../../Forms/Forms';
import rateLimit from '../../../modules/rate-limit';
import customFormValidator from '../../../modules/custom-form-validator';

const testAllFieldsForm = {
  _id: 'schemaidgeafeageahea3a3h',
  ownerId: 'owneridggeabeafeav4a3agah4a3t',
  accountName: 'steve-school',
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
  ],
};

export const studentsInsert = new ValidatedMethod({
  name: 'students.insert',
  validate: null,
  run(input) {
    try {
      // Verify data against schema stored in DB

      // const getForm = Forms.findOne(input.formId);
      const getForm = { ...testAllFieldsForm };

      // Check if form should be used to submit to this Collection.
      if (getForm.formCollection !== 'students') throw Meteor.error('500', 'Form is not of correct type');

      // Revalidate data server side using form stored in DB
      const formErrors = customFormValidator(input, getForm.rules, getForm.messages);

      if (formErrors) {
        throw Meteor.Error('500', 'Form data does not match form schema');
      }

      // Verify if user is allowed to edit according to form.
      const isAdmin = Roles.userIsInRole(this.userId, 'admin', getForm.accountName);

      // Roles in a Form may be a global Role or a userId.
      const possibleUserRoles = [...Meteor.user().roles[getForm.accountName], this.userId];

      // Test each user role by all roles in form. If included, then user is allowed.
      const isAllowedEditByForm = possibleUserRoles.some((role) => {
        if (getForm.editAllow[role]) return true;
        return false;
      });
      // use for EDIT: const isOwner = (this.userId === input.owner);

      if (isAdmin || isAllowedEditByForm) {

        const obj = {
          ...input,
          accountName: Meteor.user().current.currentOrg,
          owner: this.userId,
          dateCreated: (new Date()).toISOString(),
          activityLog: [],
          formType: 'students',
        };

        return Students.insert(obj);
      } else {
        throw new Meteor.Error('500', 'Unauthorized');
      }
    } catch (e) {
      throw new Meteor.Error('500', e);
    }
  },
});

export const studentsEdit = new ValidatedMethod({
  name: 'students.edit',
  validate: null,
  run(input) {
    try {
      // Verify data against schema stored in DB

      // Get current document
      const getCurrentDocument = Students.findOne(input._id);

      // Get the form the current document used when it was created -
      // a document must always use the same form.
      // const getForm = Forms.findOne(getCurrentDocument.formId);
      const getForm = { ...testAllFieldsForm }

      // Check if form should be used to submit to this Collection.
      if (getForm.formCollection !== 'students') throw Meteor.error('500', 'Form is not of correct type');

      // Revalidate data server-side using form rules stored in DB
      const formErrors = customFormValidator(input, getForm.rules, getForm.messages);
      if (formErrors) {
        throw Meteor.Error('500', 'Form data does not match form schema');
      }

      // Verify if user is allowed to edit according to form.
      // Is user admin?
      const user = Meteor.user();
      const isAdmin = Roles.userIsInRole(this.userId, 'admin', getForm.accountName);
      // Is user included in the editAllowed field for the form?
      // Roles in a Form may be a global Role or a userId.
      const possibleUserRoles = [...user.roles[getForm.accountName], this.userId];
      // Test each user role by all roles in form. If included, then user is allowed.
      const isAllowedEditByForm = possibleUserRoles.some((role) => {
        if (getForm.editAllow[role]) return true;
        return false;
      });
      // Is the user the owner of the original document?
      const isOwner = (this.userId === getCurrentDocument.owner);

      if (isAdmin || isAllowedEditByForm || isOwner) {
        console.log('allowed to edit, editing...')

        const newActivity = `Edited by ${user.profile.name.first} ${user.profile.name.last} on ${(new Date()).toISOString()}`

        const obj = {
          ...input,
          accountName: getCurrentDocument.accountName,
          owner: getCurrentDocument.owner,
          dateCreated: getCurrentDocument.dateCreated,
          activityLog: [...getCurrentDocument.activityLog, newActivity],
          lastEdited: (new Date()).toISOString(),
          formType: getCurrentDocument.formType,
        };

        return Students.update(getCurrentDocument._id, { $set: obj });
      } else {
        throw new Meteor.Error('500', 'Unauthorized');
      }
    } catch (e) {
      throw new Meteor.Error('500', e);
    }
  },

});

export const studentsDelete = new ValidatedMethod({
  name: 'students.delete',
  validate: new SimpleSchema({
    docId: { type: Date },
  }).validator(),
  run({ docId }) {
    try {
      // Get current doc.
      const getCurrentDocument = Students.findOne(docId);

      // Get the form the current document used when it was created -
      // a document must always use the same form.
      // const getForm = Forms.findOne(getCurrentDocument.formId);
      const getForm = { ...testAllFieldsForm }

      // Check if form can be used to edit this Collection.
      if (getForm.formCollection !== 'students') throw Meteor.error('500', 'Form is not of correct type');

      // Verify if user is allowed to edit according to form.
      // Is user admin?
      const user = Meteor.user();
      const isAdmin = Roles.userIsInRole(this.userId, 'admin', getForm.accountName);
      // Is user included in the editAllowed field for the form?
      // Roles in a Form may be a global Role or a userId.
      const possibleUserRoles = [...user.roles[getForm.accountName], this.userId];
      // Test each user role by all roles in form. If included, then user is allowed.
      const isAllowedEditByForm = possibleUserRoles.some((role) => {
        if (getForm.editAllow[role]) return true;
        return false;
      });
      // Is the user the owner of the original document?
      const isOwner = (this.userId === getCurrentDocument.owner);

      if (isAdmin || isAllowedEditByForm || isOwner) {
        console.log('allowed to remove, removing...')

        return Students.remove(getCurrentDocument._id);
      } else {
        throw new Meteor.Error('500', 'Unauthorized');
      }
    } catch (e) {
      throw new Meteor.Error('500', e);
    }



  },
});

rateLimit({
  methods: [
    'uploads.insert',
    'uploads.update',
    'uploads.remove',
    'uploads.download',
  ],
  limit: 2,
  timeRange: 5000,
});
