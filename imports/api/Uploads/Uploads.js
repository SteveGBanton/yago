/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Uploads = new Mongo.Collection('Uploads');

Uploads.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Uploads.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Uploads.schema = new SimpleSchema({
  accountName: {
    type: String,
    label: 'The account/username this upload belongs to.',
  },
  ownerId: {
    type: String,
    label: 'The ID of the user that uploaded this doc.',
  },
  dateCreated: {
    type: String,
    label: 'The date this document was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  name: {
    type: String,
    label: 'The original filename of the upload, without appended ID.',
  },
  url: {
    type: String,
    label: 'The url.',
  },
  key: {
    type: String,
    label: 'The S3 path, including new filename with appended ID.',
  },
  formCollection: {
    optional: true,
    type: String,
    label: 'The S3 path, including new filename with appended ID.',
  },
  docId: {
    optional: true,
    type: String,
    label: 'The S3 path, including new filename with appended ID.',
  },

});

Uploads.attachSchema(Uploads.schema);

export default Uploads;
