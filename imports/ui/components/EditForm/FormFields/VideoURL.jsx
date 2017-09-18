import React from 'react';
import PropTypes from 'prop-types';
import { HTTP } from 'meteor/http'

import TextField from 'material-ui/TextField';
import ReactPlayer from 'react-player'

import Loading from '../../../components/Loading/Loading';

export default class VideoURL extends React.Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
    this.invalidVideo = this.invalidVideo.bind(this);

    this.state = {
      videoURL: '',
      videoValid: true,
    };
  }

  componentWillMount() {
    this.setState({
      videoURL: this.props.defaultValue,
    })
  }

  handleChange(event) {
    this.setState({
      videoURL: event.target.value,
      videoValid: true,
    });
  }

  invalidVideo() {
    this.setState({
      videoValid: false,
    });
  }

  render() {

    const {
      name,
      floatingLabelText,
      refValue,
      refValueInvalidURL,
      errorText,
      maxLength
    } = this.props;
    return (
      <div>
        <TextField
          style={{ width: 320 }}
          name={name}
          floatingLabelText={floatingLabelText}
          ref={(this.state.videoValid) ? refValue : refValueInvalidURL}
          value={this.state.videoURL}
          errorText={errorText}
          maxLength={maxLength}
          onChange={this.handleChange}
        />
        <br/>
        <div style={{ background: ((this.state.videoValid) ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.05)'), width: 200, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: '15px'}}>
          {(this.state.videoValid)
            ? <ReactPlayer
              width={200}
              height={130}
              url={this.state.videoURL}
              onError={this.invalidVideo}
            />
            : <Loading />
          }
        </div>

      </div>
    )
  }
}

VideoURL.defaultProps = {
  videoURL: '',
};

VideoURL.propTypes = {
  videoURL: PropTypes.string,
};
