import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import AWS from 'aws-sdk';
import Uploads from '../Uploads';
import rateLimit from '../../../modules/rate-limit';

const userAllowed = function userAllowed(testAllowed) {
  // const testAllowed = {
  //   userId: '',
  //   allowedGroups: '',
  //   account: '',
  // }
  const userRolesForAccount = Roles.getRolesForUser(testAllowed.userId, testAllowed.account);
  let rolesLength = userRolesForAccount.length;

  while (rolesLength--) {
    if (testAllowed.allowedGroups[userRolesForAccount[rolesLength]] === true) return true
  }
  return false
};

export const uploadsInsert = new ValidatedMethod({
  name: 'uploads.insert',
  validate: new SimpleSchema({
    dateCreated: { type: Date },
    name: { type: String },
    url: { type: String },
    key: { type: String },
  }).validator(),
  run(file) {
    try {
      if (!this.userId) throw Meteor.Error('500', 'Must be logged in to upload');
      const obj = {
        ...file,
        accountName: Meteor.user().current.currentOrg,
        owner: this.userId,
      };
      return Uploads.insert(obj);
    } catch (e) {
      throw new Meteor.Error('500', e);
    }
  },
});

export const uploadsRemoveOne = new ValidatedMethod({
  name: 'uploads.remove',
  validate: new SimpleSchema({
    uploadId: { type: String },
  }).validator(),
  run({ uploadId }) {

    console.log(uploadId)
    // Only admin or user that uploaded can edit/view this doc.
    const uploadDoc = Uploads.findOne(uploadId)
    console.log(uploadDoc)
    const isAdmin = Roles.userIsInRole(this.userId, 'admin', uploadDoc.accountName);
    const isOwner = (this.userId === uploadDoc.owner);
    console.log(isAdmin)
    console.log(isOwner)
    try {
      // TODO re-create this Pseudocode

      if (isAdmin || isOwner) {
        const params = {
          Bucket: Meteor.settings.awsBucket,
          Key: uploadDoc.key,
        };
        console.log(params)
        const s3 = new AWS.S3({
          secretAccessKey: Meteor.settings.AWSSecretAccessKey,
          accessKeyId: Meteor.settings.AWSAccessKeyId,
        });
        s3.deleteObject(params, (err, data) => {
          if (err) {
            console.log('AWS Delete Error:')
            console.log(err)
            throw new Meteor.Error('500', err.reason);
          }
          console.log('should have been removed...')
          console.log(data)
        });
        Uploads.remove(uploadDoc._id);
      } else {
        throw new Meteor.Error('500', 'Unauthorized');
      }
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  }
})

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


rateLimit({
  methods: [
    'uploads.insert',
    'uploads.update',
    'uploads.remove',
  ],
  limit: 5,
  timeRange: 1000,
});