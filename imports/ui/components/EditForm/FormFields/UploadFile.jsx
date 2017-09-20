import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../../../components/Loading/Loading';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import LinearProgress from 'material-ui/LinearProgress';

import Clear from 'material-ui/svg-icons/content/clear';
import FileUpload from 'material-ui/svg-icons/file/file-upload';
import Done from 'material-ui/svg-icons/action/done';


import './UploadFile.scss'

const style = {
  uploadBox: {
    height: 130,
    width: 300,
    margin: 20,
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexFlow: 'row wrap',
    position: 'relative',
  },
  fileBox: {
    height: 80,
    width: 300,
    margin: 20,
    padding: 0,
    position: 'relative',
  }
}

export default class UploadFile extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.uploadToS3 = this.uploadToS3.bind(this);
    this.deleteFileS3 = this.deleteFileS3.bind(this);
    this.deleteCurrentFile = this.deleteCurrentFile.bind(this);
    this.deleteNewFile = this.deleteNewFile.bind(this);
    this.resetInput = this.resetInput.bind(this);

    this.currentFile = null;
    this.newFile = null;

    this.state = {
      newFileName: '',
      currentFileName: '',
      uploadProgress: -1,
      reloadKey: new Date(),
    }
  }

  componentWillMount() {
    if (this.props.currentFile) {
      this.setState({
        currentFileName: this.props.currentFile.name,
      })
      this.currentFile = this.props.currentFile;
    }
  }

  handleChange(event) {
    // delete any new file (both from page and from server) already added
    this.deleteNewFile();

    this.newFile = event.target.files[0];

    this.setState({
      newFileName: event.target.files[0].name,
    });
  }

  uploadToS3() {
    // Upload File with Slingshot
    // Add progress bar
    // Add to Uploads collection on upload
    // On success, Delete old file from S3 & files collection - uploadsRemove method.
    this.setState({
      uploadProgress: 40,
    })
  }

  deleteFileS3(fileToDeleteFromS3) {
    // Method to delete file from S3

  }

  deleteCurrentFile() {
    this.deleteFileS3(this.props.currentFile);
    this.setState({
      currentFileName: null,
    });
    this.currentFile = null;
  }

  deleteNewFile() {
    // TODO stop any current uploaded this.uploader.xhr.stop...

    // If there is already a file uploaded to S3 for this field on this current form, delete it.
    if (this.newFile) {
      this.deleteFileS3(this.newFile);
    }

    this.setState({
      newFileName: null,
      uploadProgress: -1,
    });

    this.newFile = null;

    // Reset input so same file can be added again
    this.resetInput();
  }

  resetInput() {
    this.setState({
      reloadKey: new Date(),
    });
  }

  stopUpload() {

    // TODO this.uploader Slingshot xhr abort upload.

    this.setState({
      uploadProgress: -1,
    });

  }

  render() {
    const {
      fieldId,
      fieldName,
      refValue,
      refValueInvalidURL,
      errorText,
    } = this.props;
    return (
      <div>
        <Paper
          style={style.uploadBox}
          zDepth={1}
        >
          {fieldName}
          <input
            className="fileUploadInput"
            key={this.state.reloadKey}
            type="file"
            onChange={this.handleChange}
          />
          <p className="text10px">Drop new file here or click here to upload a new file.</p>
        </Paper>

        {(this.state.currentFileName && !this.state.newFileName)
          ?
            <Paper
              style={style.fileBox}
              zDepth={1}
            >
              <div className="itemBoxContainer">
                <div className="itemBoxLabel">
                  <p className="text10px">Current File:<br />{this.state.currentFileName}</p>
                </div>
                {(!this.state.newFileName)
                  ?
                    <div className="itemBoxButton">
                      <IconButton
                        touch
                        tooltip="Delete Current File"
                        onClick={this.deleteCurrentFile}
                      >
                        <Clear />
                      </IconButton>
                    </div>
                  : ''
                }

              </div>
            </Paper>
          : ''
        }

        {(!this.state.newFileName && !this.state.currentFileName)
          ?
            <Paper
              style={{ ...style.fileBox, background: 'rgba(0,0,0,0.05)' }}
              zDepth={1}
            >

            </Paper>
          : ''
        }

        {(this.state.newFileName)
          ?
            <Paper
              style={style.fileBox}
              zDepth={1}
            >
              <div className="itemBoxContainer">
                <div className="itemBoxLabel">
                  <p className="text10px">File to upload {(this.state.currentFileName) ? '(will replace current file)' : ''}:<br />{this.state.newFileName}</p>
                </div>
                <div className="itemBoxButton">
                  <IconButton
                    onClick={this.deleteNewFile}
                  >
                    <Clear />
                  </IconButton>
                </div>
                {(this.state.uploadProgress >= 100)
                  ?
                    <div className="itemBoxButton">
                      <IconButton
                        disabled
                      >
                        <Done />
                      </IconButton>
                    </div>
                  :
                    <div className="itemBoxButton">
                      <IconButton
                        onClick={this.uploadToS3}
                      >
                        <FileUpload />
                      </IconButton>
                    </div>
                }
                {(this.state.uploadProgress < 100 && this.state.uploadProgress > 0)
                  ?
                    <LinearProgress
                      style={{ width: '100%', position: 'absolute', bottom: 0, right: 0 }}
                      mode="determinate"
                      value={this.state.uploadProgress}
                    />
                  : ''
                }
              </div>

            </Paper>
          : ''
        }


        {/* {(this.state.newFileName && (this.state.uploadProgress < 100 || this.state.uploadProgress > 0))
          ?
            <Paper
              style={style.fileBox}
              zDepth={1}
            >
              <div className="itemBoxContainer">
                <div className="itemBoxLabel">

                </div>
                <div className="itemBoxButton">
                  <IconButton
                    onClick={this.stopUpload}
                  >
                    <Clear />
                  </IconButton>
                </div>
              </div>
            </Paper>
          : ''
        } */}



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
