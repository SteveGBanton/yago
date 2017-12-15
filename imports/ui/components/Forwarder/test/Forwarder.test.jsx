/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import React from 'react';
import { Random } from 'meteor/random';
import { expect } from 'meteor/practicalmeteor:chai';
import sinon from 'sinon';
import { check } from 'meteor/check';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import ShortLinks from '../../../../api/ShortLinks/ShortLinks';

if (Meteor.isClient) {
  import { Forwarder } from '../Forwarder';

  Enzyme.configure({ adapter: new Adapter() });

  Meteor.methods({
    'test.resetDatabase': () => ShortLinks.remove({}),
  });

  Meteor.methods({
    'test.insertShortLink': (data) => {
      check(data, Object);
      return ShortLinks.insert({
        clicks: 0,
        url: 'http://example.com',
        owner: data.userId,
        shortLink: data.shortLink,
      });
    },
  });

  describe('Forwarder.jsx', function () {

    const userId = Random.id();
    const shortLink = Random.id(7);
    let shortLinkId;

    // Stub user.
    const userStub = sinon.stub(Meteor, 'userId').callsFake(() => userId);

    beforeEach(function (done) {
      Meteor.call('test.resetDatabase');
      Meteor.call('test.insertShortLink', { userId, shortLink }, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          shortLinkId = res;
        }
        done();
      });
    });

    it('should render', function () {
      sinon.spy(Forwarder.prototype, 'componentDidMount');
      const wrapper = mount(<Forwarder />);
      expect(Forwarder.prototype.componentDidMount.calledOnce).to.equal(true);
      Forwarder.prototype.componentDidMount.restore();
    });

  });

}
