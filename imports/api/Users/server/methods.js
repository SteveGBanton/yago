import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import editProfile from './edit-profile';
import rateLimit from '../../../modules/rate-limit';

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

rateLimit({
  methods: [
    'users.sendVerificationEmail',
    'users.editProfile',
  ],
  limit: 5,
  timeRange: 1000,
});
