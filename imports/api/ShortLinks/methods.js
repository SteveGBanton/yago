import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import ShortLinks from './ShortLinks';
import rateLimit from '../../modules/rate-limit';

export const linkInsert = new ValidatedMethod({
  name: 'link.insert',
  validate: new SimpleSchema({
    url: { type: String },
  }).validator(),
  run({ url }) {

    // TODO remove all links older than X days if not owned by a user every ~100-500 inserts.

    let shortLink = Random.id(7);
    let intersection = ShortLinks.findOne({ shortLink });
    while (intersection) {
      shortLink = Random.id(7);
      intersection = ShortLinks.findOne({ shortLink });
    }

    const toInsert = {
      clicks: 0,
      url,
      shortLink,
    };

    if (this.userId) {
      toInsert.owner = this.userId;
    }

    ShortLinks.insert({ ...toInsert });

    return shortLink;
  },
});

export const linkRemove = new ValidatedMethod({
  name: 'link.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    try {
      const getDoc = ShortLinks.findOne({ _id });
      if (this.userId === getDoc.owner) {
        return ShortLinks.remove(_id);
      }
      throw new Meteor.Error('401', 'Unauthorized');
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

export const linkAddCount = new ValidatedMethod({
  name: 'link.addCount',
  validate: new SimpleSchema({
    linkId: { type: String },
  }).validator(),
  run({ linkId }) {
    try {
      console.log(linkId);
      const getLinkDoc = ShortLinks.findOne(linkId);
      if (getLinkDoc) {
        const setClicks = {
          clicks: getLinkDoc.clicks + 1,
        };
        console.log(linkId)
        return ShortLinks.update(linkId, { $set: setClicks });
      }
      throw new Meteor.Error('500', 'no shortlink found');
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'link.insert',
    'link.remove',
  ],
  limit: 4,
  timeRange: 1000,
});

rateLimit({
  methods: [
    'link.addCount',
  ],
  limit: 1,
  timeRange: 5000,
});
