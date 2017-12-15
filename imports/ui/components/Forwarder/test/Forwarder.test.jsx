/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

// if (Meteor.isServer) {
//   import 'jsdom-global/register';
// }
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
  
  describe('Forwarder.jsx', function () {

    it('should render', function () {
      sinon.spy(Forwarder.prototype, 'componentDidMount');
      const wrapper = mount(<Forwarder />);
      expect(Forwarder.prototype.componentDidMount.calledOnce).to.equal(true);
      Forwarder.prototype.componentDidMount.restore();
    });

  });

}
