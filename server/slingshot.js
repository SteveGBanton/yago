import { Random } from 'meteor/random';

Slingshot.fileRestrictions("uploadToS3", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif", "video/mp4", "video/quicktime"],
  maxSize: 1 * 1024 * 400000,
});

Slingshot.createDirective("uploadToS3", Slingshot.S3Storage, {
  bucket: "acad-admin",
  contentDisposition: "attachment",
  authorize() {
    // TODO Log size of each user's uploads and deletes to user obj.
    if (this.userId) return true;
    return false;
  },
  key(file) {
    const index = file.name.lastIndexOf('.');
    const addId = [file.name.substring(0, index), '-', Random.id(20), file.name.substring(index)].join('');

    const user = Meteor.users.findOne(this.userId);
    return `${user.current.currentOrg}/${user._id}/${addId}`;
  },
});
