import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../../../components/Loading/Loading';

import TextField from 'material-ui/TextField';

export default class ImageURL extends React.Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
    this.invalidImage = this.invalidImage.bind(this);

    this.state = {
      imageURL: '',
      imageValid: true,
    }
  }

  componentWillMount() {
    this.setState({
      imageURL: this.props.defaultValue,
    })
  }

  handleChange(event) {
    this.setState({
      imageURL: event.target.value,
      imageValid: true,
    });
  }

  invalidImage() {
    this.setState({
      imageValid: false,
    });
  }

  render() {
    const { name, floatingLabelText, refValue, refValueInvalidURL,  errorText, maxLength } = this.props;
    return (
      <div>
        <TextField
          style={{ width: 320 }}
          name={name}
          floatingLabelText={floatingLabelText}
          ref={(this.state.imageValid) ? refValue : refValueInvalidURL}
          value={this.state.imageURL}
          errorText={errorText}
          maxLength={maxLength}
          onChange={this.handleChange}
        />
        <br/>
        <div style={{ background: ((this.state.imageValid) ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.05)'), width: 200, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: '15px' }}>
          {(this.state.imageValid)
            ? <img
              alt=""
              src={this.state.imageURL}
              style={{ maxWidth: 200, maxHeight: 130 }}
              onError={this.invalidImage}
            />
            : <Loading />
          }
        </div>

      </div>
    )
  }
}

ImageURL.defaultProps = {
  imageURL: '',
};

ImageURL.propTypes = {
  imageURL: PropTypes.string,
};
