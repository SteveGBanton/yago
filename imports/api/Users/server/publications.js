import { Meteor } from 'meteor/meteor';

Meteor.publish('users.editProfile', function usersProfile() {
  return Meteor.users.find(this.userId, {
    fields: {
      emails: 1,
      profile: 1,
      services: 1,
    },
  });
});

Meteor.publish(null, function () {
  // Select only the users that match the array of IDs passed in
  const selector = {
    _id: this.userId
  };
  // Only return one field, `initials`
  const options = {
    fields: { current: 1, testfield: 1 }
  };
  return Meteor.users.find(selector, options);
});
