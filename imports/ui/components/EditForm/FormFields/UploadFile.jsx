import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../../../components/Loading/Loading';

import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

const style = {
  paper: {
    height: 130,
    width: 300,
    margin: 20,
    padding: 20,
    textAlign: 'center',
    display: 'inline-block',
  }
}

export default class UploadFile extends React.Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
    this.invalidFile = this.invalidFile.bind(this);

    this.state = {
      fileURL: '',
      fileValid: true,
    }
  }

  componentWillMount() {
    this.setState({
      fileURL: this.props.defaultValue,
    })
  }

  handleChange(event) {
    this.setState({
      fileURL: event.target.value,
    });
  }

  invalidFile() {
    this.setState({
      fileValid: false,
    });
  }

  shortFileName() {
    // get full url
    var url = this.state.fileURL;
    // removes the anchor at the end, if there is one
    url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
    // removes the query after the file name, if there is one
    url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
    // removes everything before the last slash in the path
    url = url.substring(url.lastIndexOf("/") + 1, url.length);

    return url;
  }

  render() {
    const {
      name,
      floatingLabelText,
      refValue,
      refValueInvalidURL,
      errorText,
    } = this.props;
    return (
      <div>
        <Paper
          style={style.paper}
          zDepth={1}
        >
          {(this.state.fileValid && this.state.fileURL)
            ? this.shortFileName()
            : <Loading />
          }
          <br />
          Drop new file here or click here to upload a new file.
        </Paper>
        <br />
        {/* <TextField
          style={{ width: 320 }}
          name={name}
          floatingLabelText={floatingLabelText}
          ref={(this.state.fileValid) ? refValue : refValueInvalidURL}
          value={this.state.fileURL}
          errorText={errorText}
          onChange={this.handleChange}
          disabled
        /> */}
        <br />
        <div>
          {(this.state.fileValid && this.state.fileURL)
            ? this.state.fileURL
            : <Loading />
          }
        </div>

      </div>
    )
  }
}

UploadFile.defaultProps = {
  fileURL: '',
};

UploadFile.propTypes = {
  fileURL: PropTypes.string,
};
