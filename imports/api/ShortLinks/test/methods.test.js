/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
// Note: Arrow functions are discouraged in Mocha, which is why they were
//       disabled here. Arrow functions mess with the `this` context of Mocha.

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { expect } from 'meteor/practicalmeteor:chai';
import sinon from 'sinon';

import ShortLinks from '../ShortLinks';

import {
  linkInsert,
  linkRemove,
  linkAddCount,
} from "../methods";

if (Meteor.isServer) {
  describe('ShortLinks methods', function () {
    const userId = Random.id();
    const mockURL = {
      url: 'http://facebook.com/',
    };
    const mockUser = { userId, user: { username: 'john-doe' } };
    const mockShortLink = Random.id(7);
    const mockData = {
      _id: Random.id(),
      clicks: 0,
      url: 'http://facebook.com/',
      shortLink: mockShortLink,
      owner: userId,
    };

    let sandbox;
    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('linkInsert', function () {
      let findStub;
      let insertStub;


      beforeEach(function () {
        findStub = sandbox.stub(ShortLinks, 'findOne');
        insertStub = sandbox.stub(ShortLinks, 'insert');
      });

      it('should call ShortLinks.insert with "anon" as owner if no user is specifed', function () {
        findStub.returns(false); // assume code avoids intersection with another shortlink
        linkInsert._execute({}, mockURL);
        expect(insertStub.getCall(0).args[0].owner).to.equal('anon');
        expect(insertStub.getCall(0).args[0].url).to.equal(mockURL.url);
        expect(insertStub.getCall(0).args[0].clicks).to.equal(0);
      });

      it('should call ShortLinks.insert with userID as owner when logged in', function () {
        findStub.returns(false); // assume code avoids intersection with another shortlink
        linkInsert._execute(mockUser, mockURL);
        expect(insertStub.getCall(0).args[0].owner).to.equal(mockUser.userId);
        expect(insertStub.getCall(0).args[0].url).to.equal(mockURL.url);
        expect(insertStub.getCall(0).args[0].clicks).to.equal(0);
      });
    });

    describe('linkRemove', function () {
      let findStub;
      let removeStub;

      beforeEach(function () {
        findStub = sandbox.stub(ShortLinks, 'findOne');
        removeStub = sandbox.stub(ShortLinks, 'remove');
      });

      it('should call ShortLinks.remove with _id if user is owner', function () {
        findStub.returns(mockData);
        linkRemove._execute(mockUser, { _id: mockData._id });
        expect(removeStub.getCall(0).args[0]).to.equal(mockData._id);
      });

      it('should throw error if attempting to remove a link not belonging to user', function () {
        findStub.returns(mockData);
        expect(() => {
          linkRemove._execute({ userId: Random.id(5) }, { _id: mockData._id });
        }).to.throw();
      });

      it('should throw error if no document exists by input id', function () {
        findStub.returns(false);
        expect(() => {
          linkRemove._execute(mockUser, { _id: mockData._id });
        }).to.throw();
      });
    });

    describe('linkAddCount', function () {
      let findStub;
      let updateStub;

      beforeEach(function () {
        findStub = sandbox.stub(ShortLinks, 'findOne');
        updateStub = sandbox.stub(ShortLinks, 'update');
      });

      it('should call ShortLinks.update and add 1 to clicks property', function () {
        findStub.returns(mockData); // assume code avoids intersection with another shortlink
        linkAddCount._execute({}, { linkId: mockData._id });

        const expected = [
          mockData._id,
          { $set: { clicks: 1 } },
        ];

        expect(updateStub.getCall(0).args[0]).to.equal(expected[0]);
        expect(updateStub.getCall(0).args[1]).to.deep.equal(expected[1]);
      });
    });
  });
}

