import React from 'react';
import Loading from '../Loading/Loading';
import PropTypes from 'prop-types';

import customFormValidator from '../../../modules/custom-form-validator';
import ImageURL from './FormFields/ImageURL'
import VideoURL from './FormFields/VideoURL'
import UploadFile from './FormFields/UploadFile'

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Toggle from 'material-ui/Toggle';
import Slider from 'material-ui/Slider';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

const styles = {
  elementDiv: {
    marginTop: '40px',
  },
  elementText: {
    marginTop: '5px',
    padding: 20,
    margin: 20,
    width: 350,
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'column wrap',
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'column wrap'
  }
};

export default class EditForm extends React.Component {

  constructor(props) {
    super(props);
    this.buildForm = this.buildForm.bind(this);
    this.formValidate = this.formValidate.bind(this);
    this.setDynamicStateOnAction = this.setDynamicStateOnAction.bind(this);

    this.state = ({
      formErrors: {},
    });
  }

  componentWillMount() {
    this.buildForm();
  }

  handleSubmit(input, uploads) {
    console.log('submitting')
    console.log(input)
    const { doc, form } = this.props;

    // Use either edit or insert from formCollection
    const methodToUse = (doc._id) ? `${form.formCollection}.edit` : `${form.formCollection}.insert`;

    // TODO Create submit / edit method.
    Meteor.call(methodToUse, input, (err, docId) => {
      if (err) {
        console.error('error executing edit or insert');
        console.error(err);
      } else {
        // updates attached uploads Collection with document Id and formCollection
        uploads.forEach((upload) => {
          const uploadWithId = { ...upload };
          // Add new doc id
          uploadWithId.docId = docId;
          console.log(uploadWithId);

          // Update collection with each upload to label uploads as attached to
          // this form.
          // Unlableled uploads are kept if they are not attached to a form -
          // they can be deleted in the Upload browser.
          Meteor.call('uploads.addFormId', {
            _id: uploadWithId._id,
            docId: uploadWithId.docId,
            formCollection: form.formCollection,
          }, (uploadUpdateErr, res) => {
            if (uploadUpdateErr) console.error(uploadUpdateErr);
          });
        });
      }


    })

    // TODO Attach this doc id to any uploaded files after addition to Doc collection.
    // Find uploaded files with by taking the id from this.fieldId on fields that are uploads...

    const uploadsToEditInCollection = [];


  }

  formValidate() {
    const input = {};
    const uploads = [];

    // get data for each field - requires different access for certain fields.
    this.props.form.schema.forEach((item) => {
      if (this[item.fieldId] && item.type === 'text-area') {
        input[item.fieldId] = this[item.fieldId].input.refs.input.value;
      } else if (
          (this[item.fieldId] && item.type === 'dropdown-single-select')
          || (this[item.fieldId] && item.type === 'dropdown-multi-select')
        ) {
        input[item.fieldId] =
          (this.state[item.fieldId])
          ? (this.state[item.fieldId])
          : this[item.fieldId];
      } else if (
        (this[item.fieldId] && item.type === 'radio')
        || (this[item.fieldId] && item.type === 'multiple-choice')
      ) {
        input[item.fieldId] = (this[item.fieldId].state) ? (this[item.fieldId].state.selected) : '';
      } else if (
        (this[item.fieldId] && item.type === 'toggle')
      ) {
        input[item.fieldId] = (this[item.fieldId].state) ? (this[item.fieldId].state.switched) : '';
      } else if (
        (this[item.fieldId] && item.type === 'slider')
      ) {
        input[item.fieldId] = (this[item.fieldId].state) ? (this[item.fieldId].state.value) : '';
      } else if (
        (this[item.fieldId] && item.type === 'date-picker')
      ) {
        input[item.fieldId] = (this[item.fieldId].state) ? (this[item.fieldId].state.date) : '';
      } else if (
        (this[item.fieldId] && item.type === 'time-picker')
      ) {
        input[item.fieldId] = (this[item.fieldId].state) ? (this[item.fieldId].state.time) : '';
      } else if (
        (this[item.fieldId] && item.type === 'file-upload')
      ) {
        input[item.fieldId] = (this[item.fieldId]) ? (this[item.fieldId]) : '';
        uploads.push(((this[item.fieldId]) ? (this[item.fieldId]) : ''));
      } else if (this[item.fieldId] || this[item.fieldId] === '') {
        input[item.fieldId] = (this[item.fieldId].input) ? (this[item.fieldId].input.value) : '';
      }

    });

    // add form Id and doc id if one already exists
    input.formId = this.props.form._id;
    if (this.props.doc._id) {
      input._id = this.props.doc._id;
    }

    const formErrors = customFormValidator(input, this.props.form.rules, this.props.form.messages);

    if (!formErrors) {
      this.handleSubmit(input, uploads)
      this.setState({ formErrors })
    } else {
      this.setState({ formErrors })
    }
    console.log(this.state.formErrors)
  }

  setDynamicStateOnAction(fieldId, value) {
    this.setState({
      [fieldId]: value,
    }, () => {
      console.log(this.state)
    })
  }

  errorNote(fieldId) {
    return (
      <span style={{ color: 'red', fontSize: '12px' }}>
        {(this.state.formErrors[fieldId]) ? `  * ${this.state.formErrors[fieldId]}` : null}
      </span>
    )
  }

  marksNotice(weight) {
    return (
      <span style={{ color: 'blue', fontSize: '12px' }}>
        {(weight) ? ` Marks: ${weight}` : null}
      </span>
    )
  }

  buildForm() {
    const { doc } = this.props;
    const forms = [];
    this.props.form.schema.forEach((item) => {

      if (item.type === 'text-field') {
        const temp =
          (
            <div key={item.fieldId} style={styles.elementText}>
              <TextField
                defaultValue={(doc[item.fieldId]) ? doc[item.fieldId] : null}
                name={(item.fieldId) ? (item.fieldId) : null}
                floatingLabelText={(item.fieldName) ? (item.fieldName) : null }
                ref={input => (this[item.fieldId] = input)}
                errorText={this.state.formErrors[item.fieldId]}
                maxLength={(item.rules.maxLength) ? item.rules.maxLength : 25}
              />
            </div>
          );
        forms.push(temp);
      }

      if (item.type === 'text-area') {
        const temp =
          (
            <div key={item.fieldId} style={styles.elementText}>
              <TextField
                multiLine
                rows={3}
                rowsMax={8}
                defaultValue={(doc[item.fieldId]) ? doc[item.fieldId] : null}
                name={item.fieldId}
                floatingLabelText={item.fieldName}
                ref={input => (this[item.fieldId] = input)}
                errorText={this.state.formErrors[item.fieldId]}
                maxLength={(item.rules.maxLength) ? item.rules.maxLength : 250}
              />
            </div>
          );
        forms.push(temp);
      }

      if (item.type === 'dropdown-single-select') {
        // set this.fieldId in case field is is not updated and state is not set.
        this[item.fieldId] = doc[item.fieldId];

        const temp =
          (
            <div key={item.fieldId} style={styles.elementText}>
              <SelectField
                floatingLabelText={item.fieldName}
                defaultValue={0}
                errorText={this.state.formErrors[item.fieldId]}
                value={(this.state[item.fieldId]) ? (this.state[item.fieldId]) : this[item.fieldId]}
                onChange={(event, index, value) => (
                  this.setDynamicStateOnAction(item.fieldId, value)
                )}
              >
                {item.dropdownSingleSelectOptions.map((option, index) => (
                  <MenuItem key={`${option}-${item.fieldId}`} value={option} primaryText={option} />
                ))}
              </SelectField>
            </div>
          );
        forms.push(temp);
      }

      if (item.type === 'dropdown-multi-select') {
        // set this.fieldId in case field is is not updated and state is not set.
        this[item.fieldId] = doc[item.fieldId];

        // use state if set
        const currentValue =
          (this.state[item.fieldId])
          ? (this.state[item.fieldId])
          : this[item.fieldId];
        const temp =
          (
            <div key={item.fieldId} style={styles.elementText}>
              <SelectField
                multiple
                floatingLabelText={item.fieldName}
                defaultValue={0}
                errorText={this.state.formErrors[item.fieldId]}
                value={currentValue}
                onChange={(event, index, value) => (
                  this.setDynamicStateOnAction(item.fieldId, value)
                )}
              >
                {item.dropdownMultiSelectOptions.map(option => (
                  <MenuItem
                    key={`${option}-${item.fieldId}`}
                    value={option}
                    primaryText={option}
                    checked={currentValue && currentValue.indexOf(option) > -1}
                  />
                ))}
              </SelectField>
            </div>
          );
        forms.push(temp);
      }

      if (item.type === 'radio') {
        const temp =
          (
            <div key={item.fieldId} style={styles.elementDiv}>
              {item.fieldName}
              {this.errorNote(item.fieldId)}
              <RadioButtonGroup
                ref={input => (this[item.fieldId] = input)}
                style={{ marginTop: '20px' }}
                name={item.fieldName}
                defaultSelected={doc[item.fieldId]}
              >
                {item.radioOptions.map(option => (
                  <RadioButton
                    key={`${option}-${item.fieldId}`}
                    value={option}
                    label={option}
                    style={{ marginBottom: '10px' }}
                  />
                ))}
              </RadioButtonGroup>
            </div>
          );
        forms.push(temp);
      }

      if (item.type === 'multiple-choice') {
        const temp =
          (
            <div key={item.fieldId} style={styles.elementDiv}>
              {item.fieldName}
              {this.marksNotice(item.multipleChoiceWeight)}
              {this.errorNote(item.fieldId)}
              <RadioButtonGroup
                ref={input => (this[item.fieldId] = input)}
                style={{ marginTop: '20px' }}
                name={item.fieldName}
              >
                {item.multipleChoiceOptions.map(option => (
                  <RadioButton
                    key={`${option}-${item.fieldId}`}
                    value={option}
                    label={option}
                    style={{ marginBottom: '10px' }}
                  />
                ))}
              </RadioButtonGroup>
            </div>
          );
        forms.push(temp);
      }

      if (item.type === 'toggle') {
        const temp =
          (
            <div key={item.fieldId} style={styles.elementDiv}>
              <Toggle
                label={item.fieldName}
                style={{ marginTop: '20px' }}
                ref={input => (this[item.fieldId] = input)}
                defaultToggled={doc[item.fieldId]}
                labelPosition="right"
              />
              {this.errorNote(item.fieldId)}
            </div>
          );
        forms.push(temp);
      }

      if (item.type === 'slider') {
        const temp =
          (
            <div key={item.fieldId} style={styles.elementDiv}>
              {item.fieldName}
              {this.errorNote(item.fieldId)}
              <Slider
                defaultValue={doc[item.fieldId]}
                style={{ marginTop: '20px' }}
                style={{ width: 400 }}
                min={item.sliderMin}
                max={item.sliderMax}
                step={item.sliderStep}
                ref={input => (this[item.fieldId] = input)}
              />
            </div>
          );
        forms.push(temp);
      }

      if (item.type === 'progress') {
        const temp =
          (
            <div key={item.fieldId} style={styles.elementDiv}>
              {item.fieldName}
              {this.errorNote(item.fieldId)}
              <Slider
                defaultValue={doc[item.fieldId]}
                style={{ marginTop: '20px', width: 400 }}
                min={item.sliderMin}
                max={item.sliderMax}
                step={item.sliderStep}
                ref={input => (this[item.fieldId] = input)}
              />
            </div>
          );
        forms.push(temp);
      }

      if (item.type === 'date-picker') {
        const temp =
          (
            <div key={item.fieldId} style={styles.elementDiv}>
              {item.fieldName}
              {this.errorNote(item.fieldId)}
              <DatePicker
                hintText="Please choose a date"
                defaultDate={doc[item.fieldId]}
                ref={input => (this[item.fieldId] = input)}
              />
            </div>
          );
        forms.push(temp);
      }

      if (item.type === 'time-picker') {
        const temp =
          (
            <div key={item.fieldId} style={styles.elementDiv}>
              {item.fieldName}
              {this.errorNote(item.fieldId)}
              <TimePicker
                hintText="Please choose a time"
                format={item.format}
                ref={input => (this[item.fieldId] = input)}
              />
            </div>
          );
        forms.push(temp);
      }

      if (item.type === 'image-url') {
        const temp =
          (
            <div key={item.fieldId} style={styles.elementText}>
              <ImageURL
                defaultValue={(doc[item.fieldId]) ? doc[item.fieldId] : ''}
                name={(item.fieldId) ? (item.fieldId) : null}
                floatingLabelText={(item.fieldName) ? (item.fieldName) : ''}
                refValue={input => (this[item.fieldId] = input)}
                refValueInvalidURL={input => (this[item.fieldId] = '')}
                errorText={this.state.formErrors[item.fieldId]}
                maxLength={(item.rules.maxLength) ? item.rules.maxLength : 250}
              />
            </div>
          );
        forms.push(temp);
      }

      if (item.type === 'video-url') {
        const temp =
          (
            <div key={item.fieldId} style={styles.elementText}>
              <VideoURL
                defaultValue={(doc[item.fieldId]) ? doc[item.fieldId] : ''}
                name={(item.fieldId) ? (item.fieldId) : null}
                floatingLabelText={(item.fieldName) ? (item.fieldName) : ''}
                refValue={input => (this[item.fieldId] = input)}
                refValueInvalidURL={input => (this[item.fieldId] = '')}
                errorText={this.state.formErrors[item.fieldId]}
                maxLength={(item.rules.maxLength) ? item.rules.maxLength : 250}
              />
            </div>
          );
        forms.push(temp);
      }

      if (item.type === 'file-upload') {
        const temp =
          (
            <div key={item.fieldId} style={styles.elementDiv}>

              <UploadFile
                fileTypesAllowed={item.rules.fileTypes}
                fileSizeAllowedMax={item.rules.fileSize}
                fieldId={(item.fieldId) ? (item.fieldId) : null}
                fieldName={(item.fieldName) ? (item.fieldName) : ''}
                errorText={this.state.formErrors[item.fieldId]}
                newFileSubmit={(input) => { (this[item.fieldId] = input); }}
                currentFile={(doc[item.fieldId]) ? doc[item.fieldId] : ''}
              />
            </div>
          );
        forms.push(temp);
      }

    })

    return forms
  }

  render() {
    return (
      <div>
        <form style={styles.form} onSubmit={event => event.preventDefault()}>
          {this.buildForm().map(key => key)}

          <RaisedButton
            type="submit"
            onClick={this.formValidate}
            style={{ marginTop: '40px' }}
          >
            Submit
          </RaisedButton>

          <div style={{ color: 'red', marginTop: '20px' }}>
            {(Object.keys(this.state.formErrors).length > 0)
              ? `Please review the form, some fields are not complete`
              : null}
          </div>

        </form>
      </div>
    );
  }
}

EditForm.defaultProps = {
  doc: '',
};

EditForm.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

// TODO set propstypes and default value for doc.
