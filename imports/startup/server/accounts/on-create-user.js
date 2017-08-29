import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  let userToCreate = user;
  if (options.profile) userToCreate.profile = options.profile;
  if (!userToCreate.tenants) userToCreate.tenants = [];

  // userName field present gives user admin access to that account - one email address per account.
  // tenant field present gives user access to other accounts, permissions set in roles package.
  if (options.userName) {
    userToCreate.userName = options.userName;
  } else if (options.newTenant) {
    userToCreate.tenants.push(options.newTenant);
  }
  console.log(JSON.stringify(userToCreate))

  return userToCreate;
});

/*

TODO: Add tenants array to user object. A user may be an admin in one or more accts, and a student/parent/teacher in another, with same email.
TODO: add orgName to options when creating user
TODO: check if orgName exists again before adding to new user.

*/
