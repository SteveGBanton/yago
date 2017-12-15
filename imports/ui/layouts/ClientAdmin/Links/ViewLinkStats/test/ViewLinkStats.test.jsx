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

if (Meteor.isClient) {
  import { ViewLinkStats } from '../ViewLinkStats';

  Enzyme.configure({ adapter: new Adapter() });

  describe('ViewLinkStats.jsx', function () {

    it('should render', function () {
      sinon.spy(ViewLinkStats.prototype, 'componentDidMount');
      const wrapper = mount(<ViewLinkStats />);
      expect(ViewLinkStats.prototype.componentDidMount.calledOnce).to.equal(true);
      ViewLinkStats.prototype.componentDidMount.restore();
    });

  });

}
