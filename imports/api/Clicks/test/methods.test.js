/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
// Note: Arrow functions are discouraged in Mocha, which is why they were
//       disabled here. Arrow functions mess with the `this` context of Mocha.
//       Not sure if we'll use it, but it's here just to be safe.

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { expect } from 'meteor/practicalmeteor:chai';
import sinon from 'sinon';

import Clicks from '../Clicks';
import ShortLinks from '../../ShortLinks/ShortLinks';

import clicksInsert from '../methods';

if (Meteor.isServer) {
  describe('Clicks methods', function () {
    const userId = Random.id();
    const linkId = Random.id();
    const mockClickData = {
      linkId,
      owner: userId,
      ipAddress: '123.123.123.123',
      deviceType: 'Macbook Pro',
      shortLink: Random.id(7),
      url: 'http://www.facebook.com',
    };

    const mockShortLink = {
      _id: linkId,
      clicks: 0,
      url: mockClickData.url,
      shortLink: mockClickData.shortLink,
      owner: userId,
    };

    let sandbox;
    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('clickInsert', function () {
      let insertStub;
      let findStub;

      beforeEach(function () {
        insertStub = sandbox.stub(Clicks, 'insert');
        findStub = sandbox.stub(ShortLinks, 'findOne');
      });

      it('should call Clicks.insert with click data', function () {
        findStub.returns(mockShortLink);
        clicksInsert._execute({
          connection: {
            clientAddress: mockClickData.ipAddress,
            httpHeaders: {
              'user-agent': mockClickData.deviceType,
            },
          },
        }, {
          linkId: mockClickData.linkId,
        });

        expect(insertStub.getCall(0).args[0]).to.deep.equal(mockClickData);
      });
    });

    describe('clickRemove', function () {

    });
  });
}
