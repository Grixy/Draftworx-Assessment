import React, { Component } from 'react';

class SearchForm extends Component {
  render() {
    const {
      specificContactId,
      handleSpecificContactIdChange,
      getSpecificContact,
      specificContact,
      formHidden,
      handleFormToggle,
      deleteClick,
      updateClick,
      clearSpecificContact,
    } = this.props;

    return (
      <div className='contact-form' id='search-form'>
        <input
          type='text'
          value={specificContactId}
          placeholder='Enter Contact ID - our placeholder data has ID values of 1, 2 and 3.'
          onChange={handleSpecificContactIdChange}
          className='input-field'
        />
        <button className='btn btn-get' onClick={getSpecificContact}>
          Search Contact by ID
        </button>

        {specificContact && (
          <div className='specific-contact'>
            <h3>Specific Contact Details</h3>
            <p>
              <b>{specificContact.contactName}</b>
            </p>
            <p>Phone Number: {specificContact.phoneNumber}</p>
            <p>Best Time To Contact: {specificContact.bestTimeToContact}</p>
            <p>Reason For Call: {specificContact.reasonForCall}</p>
            <p>
              Notes:{' '}
              {specificContact.notes ? specificContact.notes.join(', ') : ''}
            </p>

            <button
              className='btn btn-upd'
              onClick={() => updateClick(specificContact.id)}
            >
              Update Contact
            </button>
            <button
              className='btn btn-delete'
              onClick={() => deleteClick(specificContact.id)}
            >
              Delete Contact
            </button>
            <button
              className='btn btn-add-contact'
              onClick={clearSpecificContact} // Use the passed function
            >
              Confirm and Close
            </button>
          </div>
        )}
        <div>OR</div>
        {formHidden && (
          <button className='btn btn-add-contact' onClick={handleFormToggle}>
            Create New Contact
          </button>
        )}
      </div>
    );
  }
}

export default SearchForm;
