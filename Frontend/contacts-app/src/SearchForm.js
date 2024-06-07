import React, { Component } from 'react';

//This component is a read-only form containing user info. Does also have 1 text input for searchng a user id.
class SearchForm extends Component {
  handleFormToggle = () => {
    const { formHidden, handleInputChange, clearSpecificContact } = this.props;
    // Toggle form visibility
    this.props.handleFormToggle();
    // Reset fields if the form is being shown
    if (!formHidden) {
      handleInputChange('contactName', '');
      handleInputChange('phoneNumber', '');
      handleInputChange('bestTimeToContact', '');
      handleInputChange('reasonForCall', '');
      this.props.handleSpecificContactIdChange({ target: { value: '' } }); // Reset specificContactId
      handleInputChange('notes', ['']); // Reset notes to empty array with one empty string
      clearSpecificContact(); // Clear specific contact details if any
    }
  };

  render() {
    const {
      specificContactId,
      handleSpecificContactIdChange,
      getSpecificContact,
      specificContact,
      formHidden,
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
        <button className='btn btn-add-contact' onClick={this.handleFormToggle}>
          {formHidden ? 'Create New Contact' : 'Cancel'}
        </button>
      </div>
    );
  }
}

export default SearchForm;
