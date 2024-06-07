import React, { Component } from 'react';

class InfoForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const { specificContactId, handleUpdateContactButtonClick, addClick } =
      this.props;
    if (specificContactId) {
      handleUpdateContactButtonClick();
    } else {
      addClick();
    }
  };

  render() {
    const {
      newContact,
      errors,
      timeOptions,
      handleInputChange,
      handleNoteChange,
      addNoteField,
      removeNoteField,
      specificContactId,
    } = this.props;

    return (
      <form
        className='contact-form'
        id='info-form'
        onSubmit={this.handleSubmit}
      >
        <input
          type='text'
          name='contactName'
          value={newContact.contactName}
          placeholder='Contact Name'
          onChange={handleInputChange}
          className='input-field'
        />
        {errors.contactName && (
          <div className='invalid-feedback'>{errors.contactName}</div>
        )}
        <input
          type='text'
          name='phoneNumber'
          value={newContact.phoneNumber}
          placeholder='Phone Number'
          onChange={handleInputChange}
          className='input-field'
          maxLength={10}
        />
        {errors.phoneNumber && (
          <div className='invalid-feedback'>{errors.phoneNumber}</div>
        )}
        <select
          name='bestTimeToContact'
          value={newContact.bestTimeToContact}
          onChange={handleInputChange}
          className='input-field'
        >
          <option value=''>Best Time To Contact</option>
          {timeOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.bestTimeToContact && (
          <div className='invalid-feedback'>{errors.bestTimeToContact}</div>
        )}
        <input
          type='text'
          name='reasonForCall'
          value={newContact.reasonForCall}
          placeholder='Reason For Call'
          onChange={handleInputChange}
          className='input-field'
        />
        {errors.reasonForCall && (
          <div className='invalid-feedback'>{errors.reasonForCall}</div>
        )}
        {newContact.notes.map((note, index) => (
          <div key={index} className='note-container'>
            <input
              type='text'
              value={note}
              placeholder='Note'
              onChange={(e) => handleNoteChange(index, e)}
              className='input-field'
            />
            <button
              type='button'
              className='btn btn-delete'
              onClick={() => removeNoteField(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type='button'
          className='btn btn-add-note'
          onClick={addNoteField}
        >
          Add Note
        </button>
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            <button type='submit' className='btn btn-submit'>
              {specificContactId ? 'Update Contact' : 'Add Contact'}
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default InfoForm;
