import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
    };
    this.API_URL = 'http://localhost:5108/';
  }

  componentDidMount() {
    this.refreshContacts();
  }

  async refreshContacts() {
    fetch(this.API_URL + 'api/Contacts')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ contacts: data });
      })
      .catch((error) => {
        console.error('Error fetching contacts:', error);
      });
  }

  async addClick() {
    var newNotes = document.getElementById('newContact').value;
    const data = new FormData();
    data.append('newNotes', newNotes);

    fetch(this.API_URL + 'api/CreateContact', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((result) => {
        alert(result);
        this.refreshContacts();
      });
  }

  async deleteClick(id) {
    fetch(this.API_URL + 'api/DeleteContact?id=' + id, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((result) => {
        alert(result);
        this.refreshContacts();
      });
  }

  render() {
    const { contacts } = this.state;
    return (
      <div className='App'>
        <h2>Contacts App</h2>
        <input id='newContact' />
        &nbsp;
        <button onClick={() => this.addClick()}>Add Contact</button>
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <div key={contact.id}>
              <p>
                <b>{contact.ContactName}</b>
              </p>
              <p>Phone Number: {contact.PhoneNumber}</p>
              <p>Best Time To Contact: {contact.BestTimeToContact}</p>
              <p>Reason For Call: {contact.ReasonForCall}</p>
              <p>Notes: {contact.Notes ? contact.Notes.join(', ') : ''}</p>{' '}
              &nbsp;
              <button onClick={() => this.deleteClick(contact.id)}>
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
