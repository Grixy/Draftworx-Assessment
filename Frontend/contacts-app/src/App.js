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

  refreshContacts() {
    fetch(this.API_URL + 'api/Contacts')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ contacts: data });
      })
      .catch((error) => {
        console.error('Error fetching contacts:', error);
      });
  }

  render() {
    const { contacts } = this.state;
    return (
      <div className='App'>
        <h2>Contacts App</h2>
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
