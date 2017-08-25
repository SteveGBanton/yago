import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  let userToCreate = user;
  if (options.profile) userToCreate.profile = options.profile;
  if (!userToCreate.tenants) userToCreate.tenants = [];
  if (options.orgName) userToCreate.tenants.push(options.orgName);
  return userToCreate;
});

/*

TODO: Add tenants array to user object. A user may be an admin in one or more accts, and a student/parent/teacher in another, with same email.
TODO: add orgName to options when creating user
TODO: check if orgName exists again before adding to new user.

*/
