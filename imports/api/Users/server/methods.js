import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import editProfile from './edit-profile';
import rateLimit from '../../../modules/rate-limit';

export const addAdminRole = new ValidatedMethod({
  name: 'users.addAdminRole',
  validate: null,
  run() {
    try {
      let id = this.userId
      let adminUsername = Meteor.user().username
      Roles.addUsersToRoles(id, ['client-admin'], adminUsername);

      Meteor.users.update(id, {
        $set: {
          currentRole: 'admin',
          currentOrg: adminUsername
        }
      });

    } catch (exception) {
      throw new Meteor.Error('accounts.createuser.error',
        `Error adding admin permissions. ${exception}`);
    }
  }
})

export const createNewAdminUser = new ValidatedMethod({
  name: 'users.createNewAdminUser',
  validate: new SimpleSchema({
    "email": { type: String },
    "password": { type: String },
    "username": { type: String },
    "profile": { type: Object },
    "profile.name": { type: Object },
    "profile.name.first": { type: String },
    "profile.name.last": { type: String },
  }).validator(),
  run(newAdmin) {

    try {
      var id = Accounts.createUser(newAdmin);
      if (id) {
        Roles.addUsersToRoles(id, ['client-admin'], newAdmin.username);
        console.log(this.userId)
      }
    } catch (exception) {
      Meteor.users.remove(id);
      throw new Meteor.Error('accounts.createuser.error',
        `Error creating new user. ${exception}`);
    }

    return id
  }
})

export const usersSendVerificationEmail = new ValidatedMethod({
  name: 'users.sendVerificationEmail',
  validate: null,
  run() {
    return Accounts.sendVerificationEmail(this.userId);
  }
})

export const usersEditProfile = new ValidatedMethod({
  name: 'users.editProfile',
  validate: new SimpleSchema({
    "emailAddress": { type: String },
    "profile": { type: Object },
    "profile.name": { type: Object },
    "profile.name.first": { type : String },
    "profile.name.last": { type : String },
  }).validator(),
  run(profile) {
    return editProfile({ userId: this.userId, profile })
    .then(response => response)
    .catch((exception) => {
      throw new Meteor.Error('500', exception);
    });
  }
})

export const usersCheckUsername = new ValidatedMethod({
  name: 'users.checkUsername',
  validate: new SimpleSchema({
    "potentialUserName": { type: String }
  }).validator(),
  run({potentialUserName}) {
    return Meteor.users.find({"username": potentialUserName}).count();
  }
})

rateLimit({
  methods: [
    'users.sendVerificationEmail',
    'users.editProfile',
  ],
  limit: 5,
  timeRange: 1000,
});
