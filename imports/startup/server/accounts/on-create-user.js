import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  let userToCreate = user;
  if (options.profile) userToCreate.profile = options.profile;
  if (!userToCreate.tenants) userToCreate.tenants = [];

  return userToCreate;
});
