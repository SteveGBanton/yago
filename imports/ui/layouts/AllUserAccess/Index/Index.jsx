import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import Navigation from '../../../components/Navigation/Navigation.jsx';

import './Index.scss';

const Index = (props) => (
  <div className="Index">
    <img
      src="https://s3-us-west-2.amazonaws.com/cleverbeagle-assets/graphics/email-icon.png"
      alt="Clever Beagle"
    />
    <h1>Pup</h1>
    <p>A boilerplate for products.</p>
    <div>
      <RaisedButton href="http://cleverbeagle.com/pup">Read the Docs</RaisedButton>
      <RaisedButton href="https://github.com/cleverbeagle/pup"><i className="fa fa-star" /> Star on GitHub</RaisedButton>
    </div>
    <footer>
      <p>Need help and want to stay accountable building your product? <a href="http://cleverbeagle.com?utm_source=pupappindex&utm_campaign=oss">Check out Clever Beagle</a>.</p>
    </footer>
  </div>
);

export default Index;
