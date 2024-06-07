import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './App.css';
import InfoForm from './InfoForm';
import SearchForm from './SearchForm';
import { apiRequest } from './Api';

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
      formHidden: true,
    };
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

  getSpecificContact = async () => {
    const { specificContactId } = this.state;

    try {
      const data = await apiRequest(
        `api/Contacts/GetContact/${specificContactId}`
      );
      this.setState({ specificContact: data });
    } catch (error) {
      alert('Contact not found');
    }
  };

  async refreshContacts() {
    try {
      const data = await apiRequest('api/Contacts/GetContacts');
      this.setState({ contacts: data });
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  }

  handleInputChange = (name, value, errorMessage) => {
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
      return {
        newContact: {
          ...prevState.newContact,
          notes: updatedNotes,
        },
      };
    });
  };

  addClick = async () => {
    const { newContact } = this.state;

    if (!newContact.contactName || !newContact.phoneNumber) {
      alert('Contact Name and Phone Number are required');
      return;
    }

    try {
      const result = await apiRequest(
        'api/Contacts/CreateContact',
        'POST',
        newContact
      );
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
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  deleteClick = async (id) => {
    this.setState({
      formHidden: true,
    });

    this.setState({ specificContactId: null });

    try {
      const result = await apiRequest(
        `api/Contacts/DeleteContact/${id}`,
        'DELETE'
      );
      alert(result);
      this.refreshContacts();
      this.setState({ specificContact: null });
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  updateContact = async () => {
    const { newContact, specificContactId, updateFromButton } = this.state;

    try {
      const result = await apiRequest(
        `api/Contacts/UpdateContact/${specificContactId}`,
        'PUT',
        newContact
      );
      alert('Contact updated successfully');
      this.refreshContacts();
      this.setState({ specificContactId: '', updateFromButton: false });
      if (updateFromButton) {
        this.getSpecificContact();
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
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
      formHidden: false,
    });
  };

  handleUpdateContactButtonClick = () => {
    const { newContact } = this.state;

    if (!newContact.contactName || !newContact.phoneNumber) {
      alert('Contact Name and Phone Number are required');
      return;
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
          handleInputChange={this.handleInputChange}
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
