import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import AWS from 'aws-sdk';
import Uploads from '../Uploads';
import rateLimit from '../../../modules/rate-limit';

// export const documentsInsert = new ValidatedMethod({
//   name: 'documents.insert',
//   validate: new SimpleSchema({
//     title: { type: String },
//     body: { type: String }
//   }).validator(),
//   run(doc) {
//     return Documents.insert({ owner: this.userId, ...doc });
//   }
// })
//
// export const documentsUpdate = new ValidatedMethod({
//   name: 'documents.update',
//   validate: new SimpleSchema({
//     _id: { type: String },
//     title: { type: String },
//     body: { type: String }
//   }).validator(),
//   run(doc) {
//       const documentId = doc._id;
//       Documents.update(documentId, { $set: doc });
//       return documentId; // Return _id so we can redirect to document after update.
//   }
// })
//
export const uploadsRemoveOne = new ValidatedMethod({
  name: 'uploads.remove',
  validate: new SimpleSchema({
    uploadId: { type: String },
    key: { type: String },
  }).validator(),
  run({uploadId, key}) {
    // Check if user is owner, admin, or allowed in roles to edit this.
    // Uploads.findOne(uploadId).editAllowed
    // Method to find if one element in roles array matches another element in editAllowed array.
    const isAdmin = 'Roles.isAdmin';
    const isOwner = 'isOwner';
    const isInRole = 'isInRole';

    try {
      // TODO re-create this Pseudocode
      if (isAdmin || isOwner || isInRole) {
        const params = {
          Bucket: Meteor.user().current.currentOrg,
          Key: key,
        };
        const s3 = new AWS.S3({
          endpoint: '',
          secretAccessKey: '',
          accessKeyId: '',
        });
        s3.deleteObject(params, function (err, data) {
          if (err) {
            return err
          }
          console.log(data);
        });
        Uploads.remove(uploadId);
      } else {
        throw new Meteor.Error('500', 'Unauthorized');
      }
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  }
})

rateLimit({
  methods: [
    'uploads.insert',
    'uploads.update',
    'uploads.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
