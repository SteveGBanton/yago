import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Uploads from '../Uploads';

Meteor.publish('uploads', function documents() {
  return Uploads.find({ owner: this.userId });
});

// Note: uploads.view is also used when editing an existing document.
Meteor.publish('uploads.view', function uploadsView(uploadId) {
  check(uploadId, String);

  // Figure out best way to use Roles to determine what data to publish
  // if (Roles === admin) {
  //   return Uploads.find({ _id: uploadId });
  // }

  return Uploads.find({ _id: uploadId, owner: this.userId });
});
