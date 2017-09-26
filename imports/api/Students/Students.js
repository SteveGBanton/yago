import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Students = new Mongo.Collection('Students');

Students.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Students.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// Students.schema = new SimpleSchema({
//   accountName: {
//     type: String,
//     label: 'The account/username this upload belongs to.',
//   },
//   owner: {
//     type: String,
//     label: 'The ID of the user that uploaded this doc.',
//   },
//   dateCreated: {
//     type: String,
//     label: 'The date this document was created.',
//     autoValue() {
//       if (this.isInsert) return (new Date()).toISOString();
//     },
//   },
//   name: {
//     type: String,
//     label: 'The original filename of the upload, without appended ID.',
//   },
//   key: {
//     type: String,
//     label: 'The S3 path, including new filename with appended ID.',
//   },
// });
//
// Students.attachSchema(Students.schema);

export default Students;
