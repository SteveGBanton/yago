import React from 'react';
import PropTypes from 'prop-types';
import { Bert } from 'meteor/themeteorchef:bert';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import LinearProgress from 'material-ui/LinearProgress';

import Clear from 'material-ui/svg-icons/content/clear';
import FileUpload from 'material-ui/svg-icons/file/file-upload';
import Done from 'material-ui/svg-icons/action/done';

import Loading from '../../../components/Loading/Loading';

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
    this.resetNewFile = this.resetNewFile.bind(this);

    this.newFile = null;
    this.currentFile = null;

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

      // Set currentFile as file to submit to form
      this.props.newFileSubmit(this.props.currentFile);
      this.currentFile = this.props.currentFile;
    }
  }

  handleChange(event) {

    // delete any new file (both from page and from server) currently added
    this.resetNewFile();

    // set newFile
    this.newFile = event.target.files[0];
    this.setState({
      newFileName: event.target.files[0].name,
    });
  }

  uploadToS3() {

    // create uploader - Slingshot
    this.uploader = new Slingshot.Upload("uploadToS3");

    // Progress bar of uploader:
    this.timer = Meteor.setInterval(() => {
      this.setState({
        uploadProgress: Math.round(this.uploader.progress() * 100),
      });
    }, 300);

    // send file with slingshot
    this.uploader.send(this.newFile, (error, url) => {
      if (error) {
        Meteor.clearInterval(this.timer);

        this.setState({
          uploadProgress: -1,
        });
        // Log detailed response.
        Bert.alert(error.reason, 'danger');
      } else {
        Meteor.clearInterval(this.timer);

        // this.setState({
        //   uploadProgress: 100,
        // });

        const getKey = url.substring(url.indexOf('/', url.indexOf('.')) + 1);

        const uploadsCollectionDoc = {
          dateCreated: new Date(),
          name: this.newFile.name,
          url: url,
          key: getKey,
        };

        let fileToDelete = '';
        if (this.currentFile && this.currentFile._id) fileToDelete = this.currentFile._id

        console.log(fileToDelete)

        // Add to file collection
        Meteor.call('uploads.insert', uploadsCollectionDoc, (error, res) => {
          if (error) {
            Bert.alert(error.reason, 'danger');

          } else {
            // Success - replace currentFile with new file.
            // Append ID:
            const uploadsCollectionDocWithId = { ...uploadsCollectionDoc };
            uploadsCollectionDocWithId._id = res;

            // add to new file upload doc with ID
            this.props.newFileSubmit(uploadsCollectionDocWithId);

            // Try to delete current file, overwrite currentFile, reset newFile.
            if (fileToDelete) this.deleteFileS3(fileToDelete)

            this.currentFile = uploadsCollectionDocWithId;
            this.setState({
              currentFileName: this.currentFile.name,
            });
            this.resetNewFile()

          }
        });

      }
    });

    // TODO Add active progress bar
    // TODO Add to Uploads collection on upload
    // TODO On success, Delete old file from S3 & files collection - uploadsRemove method.

  }

  deleteFileS3(uploadId) {
    console.log(uploadId)
    // Method to delete file from S3
    Meteor.call('uploads.remove', { uploadId }, (error, res) => {
      if (error) {
        console.log(error.reason)
      } else {
        console.log('file removed');
      }
    })
  }

  deleteCurrentFile() {
    this.deleteFileS3(this.currentFile._id);
    this.setState({
      currentFileName: '',
    });
    this.currentFile = null;
  }

  deleteNewFile(newFile) {
    // Reset progress and newFile fields.
    this.resetNewFile();

    // stop any current uploaded this.uploader.xhr.stop...

  }

  resetNewFile() {
    if (this.timer) Meteor.clearInterval(this.timer);
    if (this.uploader && this.uploader.xhr) this.uploader.xhr.abort();

    this.setState({
      newFileName: '',
      uploadProgress: -1,
    });

    this.newFile = null;

    this.setState({
      reloadKey: new Date(),
    });
  }

  stopUpload() {
    if (this.uploader && this.uploader.xhr) this.uploader.xhr.abort();
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
                    onClick={this.resetNewFile}
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
                {(this.state.uploadProgress > 0)
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
