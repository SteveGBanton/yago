import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Clicks from '../Clicks';

Meteor.publish('clicks.userTotalClickCount', () => Clicks.find({ owner: this.userId }).count());

Meteor.publish('clicks.oneLinkList', (linkId) => {
  check(linkId, String);
  return Clicks.find({ linkId });
});

Meteor.publish('clicks.oneLinkTotalCount', (linkId) => {
  check(linkId, String);
  return Clicks.find({ linkId }).count();
});
