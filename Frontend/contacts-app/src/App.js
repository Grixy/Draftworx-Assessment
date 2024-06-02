import React, { Component } from 'react';

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
        notes: [],
      },
    };
    this.API_URL = 'http://localhost:5108/';
  }

  componentDidMount() {
    this.refreshContacts();
  }

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
    this.setState((prevState) => ({
      newContact: {
        ...prevState.newContact,
        [name]: value,
      },
    }));
  };

  async addClick() {
    const { newContact } = this.state;

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
            notes: [],
          },
          contacts: [...prevState.contacts, result],
        }));
      })
      .catch((error) => {
        console.error('Error adding contact:', error);
      });
  }

  async deleteClick(id) {
    fetch(this.API_URL + 'api/Contacts/DeleteContact/' + id, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((result) => {
        alert(result);
        this.refreshContacts();
      })
      .catch((error) => {
        console.error('Error deleting contact:', error);
      });
  }

  render() {
    const { contacts, newContact } = this.state;
    return (
      <div className='App'>
        <h2>Contacts App</h2>
        <div>
          <input
            type='text'
            name='contactName'
            value={newContact.contactName}
            placeholder='Contact Name'
            onChange={this.handleInputChange}
          />
          <input
            type='text'
            name='phoneNumber'
            value={newContact.phoneNumber}
            placeholder='Phone Number'
            onChange={this.handleInputChange}
          />
          <input
            type='text'
            name='bestTimeToContact'
            value={newContact.bestTimeToContact}
            placeholder='Best Time To Contact'
            onChange={this.handleInputChange}
          />
          <input
            type='text'
            name='reasonForCall'
            value={newContact.reasonForCall}
            placeholder='Reason For Call'
            onChange={this.handleInputChange}
          />
          <button onClick={() => this.addClick()}>Add Contact</button>
        </div>
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <div key={contact.Id}>
              <p>
                <b>{contact.ContactName}</b>
              </p>
              <p>Phone Number: {contact.PhoneNumber}</p>
              <p>Best Time To Contact: {contact.BestTimeToContact}</p>
              <p>Reason For Call: {contact.ReasonForCall}</p>
              <p>Notes: {contact.Notes ? contact.Notes.join(', ') : ''}</p>{' '}
              &nbsp;
              <button onClick={() => this.deleteClick(contact.Id)}>
                Delete Contact
              </button>
            </div>
          ))
        ) : (
          <p>No contacts found</p>
        )}
      </div>
    );
  }
}

export default App;
