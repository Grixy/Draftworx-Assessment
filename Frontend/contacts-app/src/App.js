import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './App.css'; // Import the CSS file
import InfoForm from './InfoForm'; // Import the new component

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      newContact: {
        contactName: '',
        phoneNumber: '',
        bestTimeToContact: '',
        reasonForCall: '',
        notes: [''],
      },
      specificContactId: '',
      specificContact: null,
      errors: {}, // Initialize errors state
      updateFromButton: false,
      columnDefs: [
        { headerName: 'Contact Name', field: 'contactName' },
        { headerName: 'Phone Number', field: 'phoneNumber' },
        { headerName: 'Best Time To Contact', field: 'bestTimeToContact' },
        { headerName: 'Reason For Call', field: 'reasonForCall' },
        {
          headerName: 'Notes',
          field: 'notes',
          valueFormatter: this.notesFormatter,
        },
        {
          headerName: 'Actions',
          cellRenderer: this.renderActions,
        },
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 150,
        editable: true,
      },
      formHidden: true, // Add a state variable to track form visibility
    };
    this.API_URL = 'http://localhost:5108/';
  }

  componentDidMount() {
    this.refreshContacts();
  }

  notesFormatter = (params) => {
    return params.value ? params.value.join(', ') : '';
  };

  handleSpecificContactIdChange = (e) => {
    this.setState({ specificContactId: e.target.value });
  };

  getSpecificContact = () => {
    const { specificContactId } = this.state;

    fetch(this.API_URL + 'api/Contacts/GetContact/' + specificContactId)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Contact not found');
      })
      .then((data) => {
        this.setState({ specificContact: data });
      })
      .catch((error) => {
        console.error('Error fetching specific contact:', error);
        alert('Contact not found');
      });
  };

  async refreshContacts() {
    fetch(this.API_URL + 'api/Contacts/GetContacts')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ contacts: data });
      })
      .catch((error) => {
        console.error('Error fetching contacts:', error);
      });
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';

    switch (name) {
      case 'contactName':
        if (!/^[a-zA-Z\s]*$/.test(value) || value.length > 500) {
          errorMessage =
            'Contact Name should be an alphabetical string and have a maximum length of 500 characters';
        }
        break;
      case 'phoneNumber':
        if (!/^\d{10}$/.test(value)) {
          errorMessage = 'Phone Number should be a 10-digit number';
        }
        break;
      case 'reasonForCall':
        if (value.length > 1000) {
          errorMessage =
            'Reason For Call should have a maximum length of 1000 characters';
        }
        break;
      case 'notes':
        if (value.length > 2000) {
          errorMessage =
            'Notes should have a maximum length of 2000 characters';
        }
        break;
      default:
        break;
    }

    this.setState((prevState) => ({
      newContact: {
        ...prevState.newContact,
        [name]: value,
      },
      errors: {
        ...prevState.errors,
        [name]: errorMessage,
      },
    }));
  };

  handleNoteChange = (index, e) => {
    const { value } = e.target;
    this.setState((prevState) => {
      const updatedNotes = [...prevState.newContact.notes];
      updatedNotes[index] = value;
      return {
        newContact: {
          ...prevState.newContact,
          notes: updatedNotes,
        },
      };
    });
  };

  addNoteField = () => {
    this.setState((prevState) => ({
      newContact: {
        ...prevState.newContact,
        notes: [...prevState.newContact.notes, ''],
      },
    }));
  };

  removeNoteField = (index) => {
    this.setState((prevState) => {
      const updatedNotes = [...prevState.newContact.notes];
      updatedNotes.splice(index, 1);
      this.refreshContacts();
      return {
        newContact: {
          ...prevState.newContact,
          notes: updatedNotes,
        },
      };
    });
  };

  addClick = () => {
    const { newContact } = this.state;

    // Check if non-nullable fields are empty
    if (!newContact.contactName || !newContact.phoneNumber) {
      alert('Contact Name and Phone Number are required');
      return; // Prevent form submission
    }

    fetch(this.API_URL + 'api/Contacts/CreateContact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newContact),
    })
      .then((res) => res.json())
      .then((result) => {
        alert('Contact added successfully');
        this.setState((prevState) => ({
          newContact: {
            contactName: '',
            phoneNumber: '',
            bestTimeToContact: '',
            reasonForCall: '',
            notes: [''],
          },
          contacts: [...prevState.contacts, result],
        }));
      })
      .catch((error) => {
        console.error('Error adding contact:', error);
      });
  };

  deleteClick = (id) => {
    this.setState({
      formHidden: true, // Show the form
    });

    this.setState({ specificContactId: null });

    fetch(this.API_URL + 'api/Contacts/DeleteContact/' + id, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((result) => {
        alert(result);
        this.refreshContacts();
        this.setState({ specificContact: null });
      })
      .catch((error) => {
        console.error('Error deleting contact:', error);
      });
  };

  updateContact = () => {
    const { newContact, specificContactId, updateFromButton } = this.state;

    fetch(this.API_URL + 'api/Contacts/UpdateContact/' + specificContactId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newContact),
    })
      .then((res) => res.json())
      .then((result) => {
        alert('Contact updated successfully');
        this.refreshContacts();
        this.setState({ specificContactId: '', updateFromButton: false });
        if (updateFromButton) {
          this.getSpecificContact();
        }
      })
      .catch((error) => {
        console.error('Error updating contact:', error);
      });
  };

  updateClick = (id) => {
    this.setState({ specificContactId: id });

    const selectedContact = this.state.contacts.find(
      (contact) => contact.id === id
    );

    this.setState({
      newContact: {
        contactName: selectedContact.contactName,
        phoneNumber: selectedContact.phoneNumber,
        bestTimeToContact: selectedContact.bestTimeToContact,
        reasonForCall: selectedContact.reasonForCall,
        notes: selectedContact.notes,
      },
      formHidden: false, // Show the form
    });
  };

  handleUpdateContactButtonClick = () => {
    const { newContact } = this.state;

    // Check if non-nullable fields are empty
    if (!newContact.contactName || !newContact.phoneNumber) {
      alert('Contact Name and Phone Number are required');
      return; // Prevent form submission
    }

    this.setState({ updateFromButton: true }, () => {
      this.updateContact();
    });
  };

  renderActions = (params) => {
    return (
      <div>
        <button
          className='btn btn-update'
          onClick={() => this.updateClick(params.data.id)}
        >
          Update
        </button>
        <button
          className='btn btn-delete'
          onClick={() => this.deleteClick(params.data.id)}
        >
          Delete
        </button>
      </div>
    );
  };

  clearSpecificContact = () => {
    this.setState({ specificContact: null });
  };

  handleFormToggle = () => {
    this.setState((prevState) => ({
      formHidden: !prevState.formHidden,
    }));
  };

  render() {
    const {
      contacts,
      newContact,
      specificContactId,
      specificContact,
      columnDefs,
      defaultColDef,
      errors,
      formHidden,
    } = this.state;

    // Options for the bestTimeToContact dropdown
    const timeOptions = ['Morning', 'Afternoon', 'Any time'];

    return (
      <div className='App'>
        <h2>Contacts App</h2>
        <div className='contact-form' id='search-form'>
          <input
            type='text'
            value={specificContactId}
            placeholder='Enter Contact ID - our placeholder data has ID values of 1, 2 and 3.'
            onChange={this.handleSpecificContactIdChange}
            className='input-field'
          />
          <button className='btn btn-get' onClick={this.getSpecificContact}>
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
                onClick={() => this.updateClick(specificContact.id)}
              >
                Update Contact
              </button>
              <button
                className='btn btn-delete'
                onClick={() => this.deleteClick(specificContact.id)}
              >
                Delete Contact
              </button>
              <button
                className='btn btn-add-contact'
                onClick={this.clearSpecificContact}
              >
                Confirm and Close
              </button>
            </div>
          )}
          <div>OR</div>
          {formHidden && (
            <button
              className='btn btn-add-contact'
              onClick={this.handleFormToggle}
            >
              Create New Contact
            </button>
          )}
        </div>
        {!formHidden && (
          <InfoForm
            newContact={newContact}
            errors={errors}
            timeOptions={timeOptions}
            handleInputChange={this.handleInputChange}
            handleNoteChange={this.handleNoteChange}
            addNoteField={this.addNoteField}
            removeNoteField={this.removeNoteField}
            handleUpdateContactButtonClick={this.handleUpdateContactButtonClick}
            specificContactId={specificContactId}
          />
        )}
        <div
          className='ag-theme-alpine'
          style={{ height: '500px', width: '100%', marginTop: '20px' }}
        >
          <AgGridReact
            rowData={contacts}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            frameworkComponents={this.state.frameworkComponents}
          />
        </div>
      </div>
    );
  }
}

export default App;
