import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import {createUser, updateUser, deleteUser, createDevice, updateDevice, deleteDevice} from './graphql/mutations';
import {getUser, listUser, getDevice, listDevice} from './graphql/queries';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

const initialFormState = {sn: '', pass: ''}

function App() {

	const [userDevices, setUserDevices] = useState([]);
	const [formData, setFormData] = useState(initialFormState);
  
  useEffect(() => {
    getUserDevices();
  }, []);

  async function getUserDevices() {
  }

  async function getDeviceButton() {
    if (!formData.sn || !formData.pass) return;
    const apiData = await API.graphql({ query: getDevice, variables: { input: formData.sn } });
    console.log(apiData);
  }

/*
  async function addDevice() {
    if (!formData.sn || !formData.pass) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }
*/

  return (
    <div className="App">

      <h1>Enter device 'Serial Number' and 'Password' to add device to account</h1>
		  <p></p>
		
      <input
      onChange={e => setFormData({ ...formData, 'sn': e.target.value})}
      placeholder="Serial Number"
      value={formData.sn}
		  />
	  
      <input
      onChange={e => setFormData({ ...formData, 'pass': e.target.value})}
      placeholder="Password"
      value={formData.pass}
      />
		
		  <button onClick={getDeviceButton}>Add Device</button>

      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);