import logo from './logo.svg';
import './App.css';
import { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
    };
  }

  //This is naturally not something we would normally have here, but for our proof of concept I'm directly referencing the port for the API project as a variable in this space, instead of a config setting.
  API_URL = 'http://localhost:5108/';

  componentDidMount() {
    this.refreshContacts();
  }

  async refreshContacts() {
    fetch(this.API_URL + 'api/contacts-app/GetContacts')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ contacts: data });
      });
  }
  render() {
    const { contacts } = this.state;
    return (
      <div className='App'>
        <h2>Contacts App</h2>

        {contacts.map((contact, index) => (
          <p key={index}>
            <b>* {contact.ContactName}</b>
          </p>
        ))}
      </div>
    );
  }
}

export default App;
