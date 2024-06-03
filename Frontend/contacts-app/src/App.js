import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './App.css';
import InfoForm from './InfoForm';
import SearchForm from './SearchForm';

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
      errors: {},
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
    this.API_URL = 'http://localhost:5108/'; // Our hardcoded API route. This is, of course, not ideal. We'd manually have stored our API path and relevant keys in a config, but keeping it like this for a POC.
  }

  componentDidMount() {
    //Track our initial load completion.
    this.refreshContacts();
  }

  notesFormatter = (params) => {
    //Cleans up notes string array.
    return params.value ? params.value.join(', ') : '';
  };

  handleSpecificContactIdChange = (e) => {
    //If we're selecting/searching for a specific customer.
    this.setState({ specificContactId: e.target.value });
  };

  getSpecificContact = () => {
    //Get a specific customer info.
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
        alert('Contact not found'); //Instead of alerts we might favour error screens or modals.
      });
  };

  async refreshContacts() {
    //Pull the whole contact list. Needs to update independantly of other features so its async.
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
    //Validation.
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
    //If the note for the new/updating contact get changed, we track it here.
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
    //Add a new, empty note to the users notes.
    this.setState((prevState) => ({
      newContact: {
        ...prevState.newContact,
        notes: [...prevState.newContact.notes, ''],
      },
    }));
  };

  removeNoteField = (index) => {
    //Remove the current Notes field.
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
    //All click logic for the Add button.
    const { newContact } = this.state;

    // Check if non-nullable fields are empty
    if (!newContact.contactName || !newContact.phoneNumber) {
      alert('Contact Name and Phone Number are required');
      return; // Prevent form submission
    }

    //Would prefer to have all fetch calls mapped somewhere else, but keeping this here for POC.
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
    //Was the delete button clicked?
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
    //This is the actual update functionality. It goes through the click handler first.
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
    //Was the update button clicked?
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
    //was the update contact button clicked?
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

  //renderActions is a by-product of using agGrid. It handles our buttons in the Actions column of the table.
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

  //Clear the specificContact variable.
  clearSpecificContact = () => {
    this.setState({ specificContact: null });
  };

  //Hide/Show input form.
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
        <SearchForm
          specificContactId={specificContactId}
          handleSpecificContactIdChange={this.handleSpecificContactIdChange}
          getSpecificContact={this.getSpecificContact}
          specificContact={specificContact}
          formHidden={formHidden}
          handleFormToggle={this.handleFormToggle}
          clearSpecificContact={this.clearSpecificContact}
          updateClick={this.updateClick}
          deleteClick={this.deleteClick}
        />
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
            addClick={this.addClick}
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
