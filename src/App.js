// src/App.js
import React, { useState, useEffect } from 'react';

function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ fname: '', lname: '', email: '' });
  const [newAddress, setNewAddress] = useState({
    nickname: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
  });

  const apiUrl = 'http://localhost:8000';

  const fetchCustomers = () => {
    fetch(`${apiUrl}/customers`)
      .then(response => response.json())
      .then(data => setCustomers(data))
      .catch(error => console.error('Error fetching customers:', error));
  };

  const handleNewCustomerSubmit = event => {
    event.preventDefault();

    fetch(`${apiUrl}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCustomer),
      mode: 'no-cors',
    })
      .then(response => response.json())
      .then(data => {
        setCustomers([...customers, data]);
        setNewCustomer({ fname: '', lname: '', email: '' });
      })
      .catch(error => console.error('Error creating new customer:', error));
  };

  const handleCustomerClick = customerId => {
    fetch(`${apiUrl}/customer/${customerId}/addresses`)
      .then(response => response.json())
      .then(data => {
        setSelectedCustomer({ id: customerId, addresses: data });
      })
      .catch(error => console.error('Error fetching customer details:', error));
  };

  const handleNewAddressSubmit = event => {
    event.preventDefault();

    fetch(`${apiUrl}/customer/${selectedCustomer.id}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAddress),
      mode: 'no-cors',
    })
      .then(response => response.json())
      .then(data => {
        setSelectedCustomer({ ...selectedCustomer, addresses: [...selectedCustomer.addresses, data] });
        setNewAddress({
          nickname: '',
          street1: '',
          street2: '',
          city: '',
          state: '',
          zip: '',
        });
      })
      .catch(error => console.error('Error creating new address:', error));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>
      <h1>Customer List</h1>
      <ul>
        {customers.map(customer => (
          <li key={customer.id} onClick={() => handleCustomerClick(customer.id)}>
            {`${customer.fname} ${customer.lname} - ${customer.email}`}
          </li>
        ))}
      </ul>

      <h2>Create a New Customer</h2>
      <form onSubmit={handleNewCustomerSubmit}>
        <label>
          First Name:
          <input type="text" value={newCustomer.fname} onChange={e => setNewCustomer({ ...newCustomer, fname: e.target.value })} />
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" value={newCustomer.lname} onChange={e => setNewCustomer({ ...newCustomer, lname: e.target.value })} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} />
        </label>
        <br />
        <button type="submit">Create Customer</button>
      </form>

      {selectedCustomer && (
        <div>
          <h2>Customer Details</h2>
          <p>ID: {selectedCustomer.id}</p>
          <p>Addresses:</p>
          <ul>
            {selectedCustomer.addresses.map(address => (
              <li key={address.nickname}>
                {`${address.nickname || ''}: ${address.street1} ${address.street2 || ''}, ${address.city || ''}, ${address.state || ''}, ${address.zip || ''}`}
              </li>
            ))}
          </ul>

          <h2>Add a New Address</h2>
          <form onSubmit={handleNewAddressSubmit}>
            <label>
              Nickname:
              <input type="text" value={newAddress.nickname} onChange={e => setNewAddress({ ...newAddress, nickname: e.target.value })} />
            </label>
            <br />
            <label>
              Street:
              <input type="text" value={newAddress.street1} onChange={e => setNewAddress({ ...newAddress, street1: e.target.value })} />
            </label>
            <br />
            <label>
              Apt/Suite:
              <input type="text" value={newAddress.street2} onChange={e => setNewAddress({ ...newAddress, street2: e.target.value })} />
            </label>
            <br />
            <label>
              City:
              <input type="text" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
            </label>
            <br />
            <label>
              State:
              <input type="text" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} />
            </label>
            <br />
            <label>
              Zip Code:
              <input type="text" value={newAddress.zip} onChange={e => setNewAddress({ ...newAddress, zip: e.target.value })} />
            </label>
            <br />
            <button type="submit">Add Address</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
