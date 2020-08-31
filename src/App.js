import React, { useState, useEffect } from 'react';
import './App.css';
import { API, graphqlOperation } from 'aws-amplify';
import {createUser, updateUser, deleteUser, createDevice, updateDevice, deleteDevice} from './graphql/mutations';
//import {getUser, listUser, getDevice, listDevice} from './graphql/queries';
import * as queries from './graphql/queries';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
//import { queries } from '@testing-library/react';

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
    if (!formData.sn || !formData.pass){
      console.log("sn or pass is null");
      return;}
    //const apiData = await API.graphql({ query: getDevice, variables: { input: formData.sn } });
    console.log(formData.sn);
    const apiData = await API.graphql(graphqlOperation(queries.getDevice, {id: formData.sn}));
    console.log(apiData);
  }

  async function testFindButton() {
    if (!formData.sn || !formData.pass){
      console.log("sn or pass is null");
      return;}
    //const apiData = await API.graphql({ query: getDevice, variables: { input: formData.sn } });
    const apiData = await API.graphql(graphqlOperation(queries.getDevice, {id: 'V1008142'}));
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

      <button onClick={testFindButton}>Test Find</button>

      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);