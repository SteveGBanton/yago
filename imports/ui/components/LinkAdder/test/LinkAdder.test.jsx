/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import React from 'react';
import { Random } from 'meteor/random';
import { expect } from 'meteor/practicalmeteor:chai';
import TestUtils from 'react-addons-test-utils';
import sinon from 'sinon';
import jsxChai from 'jsx-chai';
import { LinkAdder } from '../LinkAdder';

chai.use(jsxChai);

describe('UserView.jsx', function () {
  it('should render', function () {
    const renderer = TestUtils.createRenderer();

    renderer.render(<LinkAdder history={{}} />);
    const actual = renderer.getRenderOutput();

    const expected = 'Add a new link'

    expect(actual).to.include(expected);
  });

  // it('should error on no input', function () {
  //   const renderer = TestUtils.createRenderer();
  //
  //   renderer.render(<LinkAdder history={{}} />);
  //
  //   // TODO Complete this test
  //   console.log(renderer);
  //
  //   const actual = renderer.getRenderOutput();
  //
  //   const expected = 'Please enter a link'
  //
  //   expect(actual).to.include(expected);
  // });

})
