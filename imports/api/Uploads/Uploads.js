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
  owner: {
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
  updatedAt: {
    type: String,
    label: 'The date this document was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  name: {
    type: String,
    label: 'The original filename of the upload, without appended ID.',
  },
  key: {
    type: String,
    label: 'The S3 path, including new filename with appended ID.',
  },
  roles: {
    type: Array,
    label: 'The user roles allowed to view this file.',
  }
});

Uploads.attachSchema(Uploads.schema);

export default Uploads;
