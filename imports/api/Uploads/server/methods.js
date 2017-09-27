import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import AWS from 'aws-sdk';
import Uploads from '../Uploads';
import rateLimit from '../../../modules/rate-limit';

// const userAllowed = function userAllowed(testAllowed) {
//   const userRolesForAccount = Roles.getRolesForUser(testAllowed.userId, testAllowed.account);
//   let rolesLength = userRolesForAccount.length;
//
//   while (rolesLength--) {
//     if (testAllowed.allowedGroups[userRolesForAccount[rolesLength]] === true) return true
//   }
//   return false;
// };

export const uploadsDownload = new ValidatedMethod({
  name: 'uploads.download',
  validate: new SimpleSchema({
    uploadId: { type: String },
  }).validator(),
  run({ uploadId }) {
    // TODO SET PERMISSIONS Only Admin, Owner and those in readAllowed can download.
    try {
      const file = Uploads.findOne(uploadId);
      const s3 = new AWS.S3({
        secretAccessKey: Meteor.settings.AWSSecretAccessKey,
        accessKeyId: Meteor.settings.AWSAccessKeyId,
      });
      const url = s3.getSignedUrl('getObject', {
        Bucket: Meteor.settings.awsBucket,
        Key: file.key,
        Expires: 30, //seconds
      });
      return url;
    } catch (e) {
      throw new Meteor.Error('500', e);
    }
  },
});

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
        ownerId: this.userId,
      };
      const id = Uploads.insert(obj);
      return id
    } catch (e) {
      throw new Meteor.Error('500', e);
    }
  },
});


export const uploadsAddFormId = new ValidatedMethod({
  name: 'uploads.addFormId',
  validate: new SimpleSchema({
    _id: { type: String },
    docId: { type: String },
    formCollection: { type: String },
  }).validator(),
  run({ _id, docId, formCollection }) {

    //TODO finish this.

    // try {
    //   if (!this.userId) throw Meteor.Error('500', 'Must be logged in to upload');
    //   const obj = {
    //     ...file,
    //     accountName: Meteor.user().current.currentOrg,
    //     ownerId: this.userId,
    //   };
    //   return Uploads.insert(obj);
    // } catch (e) {
    //   throw new Meteor.Error('500', e);
    // }
    console.log('adding form id')
  },
});

export const uploadsRemoveOne = new ValidatedMethod({
  name: 'uploads.remove',
  validate: new SimpleSchema({
    uploadId: { type: String },
  }).validator(),
  run({ uploadId }) {
    // Only admin or user that uploaded can edit this doc.
    try {
      const uploadDoc = Uploads.findOne(uploadId);
      const isAdmin = Roles.userIsInRole(this.userId, 'admin', uploadDoc.accountName);
      const isOwner = (this.userId === uploadDoc.ownerId);

      if (isAdmin || isOwner) {
        const params = {
          Bucket: Meteor.settings.awsBucket,
          Key: uploadDoc.key,
        };

        const s3 = new AWS.S3({
          secretAccessKey: Meteor.settings.AWSSecretAccessKey,
          accessKeyId: Meteor.settings.AWSAccessKeyId,
        });

        s3.deleteObject(params, (err) => {
          if (err) {
            throw new Meteor.Error('500', err.reason);
          }
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
    'uploads.download',
  ],
  limit: 2,
  timeRange: 5000,
});
