import React, { Component } from 'react';

//This component is the editable form that houses the user info for updating an existing user or creating a new one.
class InfoForm extends Component {
  render() {
    const {
      newContact,
      errors,
      timeOptions,
      handleInputChange,
      handleNoteChange,
      addNoteField,
      removeNoteField,
      handleUpdateContactButtonClick,
      specificContactId,
      addClick,
    } = this.props;

    return (
      <div className='contact-form' id='info-form'>
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
              className='btn btn-delete'
              onClick={() => removeNoteField(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button className='btn btn-add-note' onClick={addNoteField}>
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
            {specificContactId && ( // Render Update Contact button only if specificContactId is not null
              <button
                className='btn btn-upd'
                onClick={handleUpdateContactButtonClick}
              >
                Update Contact
              </button>
            )}
            {!specificContactId && (
              <button className='btn btn-add-contact' onClick={addClick}>
                Add Contact
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default InfoForm;
