import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Students from '../Students';

// TODO Change access here.
Meteor.publish('students', function documents() {
  return Students.find({});
});

// Note: students.view is also used when editing an existing document.
Meteor.publish('students.view', function documentsView(documentId) {
  check(documentId, String);

  // TODO Logic to check if Read access is allowed on doc.
  return Students.find({ _id: documentId, owner: this.userId });
});
