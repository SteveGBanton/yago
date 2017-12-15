/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import React from 'react';
import { Random } from 'meteor/random';
import { expect } from 'meteor/practicalmeteor:chai';
import TestUtils from 'react-addons-test-utils';
import sinon from 'sinon';
import jsxChai from 'jsx-chai';
import { Forwarder } from '../Forwarder';

chai.use(jsxChai);

describe('Forwarder.jsx', function () {
  it('should render', function () {
    const renderer = TestUtils.createRenderer();
    const user = undefined;

    renderer.render(<UserViewTest loading={false} history={{}} user={user} />);
    const actual = renderer.getRenderOutput();

    const expected = 'Sorry, cannot find user.';

    expect(actual).to.include(expected);
  });
})
