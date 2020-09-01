import React, { useState, useEffect } from 'react';
import './App.css';
import { API, graphqlOperation, Auth } from 'aws-amplify';
//import {createUser, updateUser, deleteUser, createDevice, updateDevice, deleteDevice} from './graphql/mutations';
import * as mutations from './graphql/mutations';
//import {getUser, listUser, getDevice, listDevice} from './graphql/queries';
import * as queries from './graphql/queries';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
//import { queries } from '@testing-library/react';

const initialFormState = {sn: '', pass: ''}
const initialUserState = {username: ''}

function App() {

  //stores user devices information
  const [userDevices, setUserDevices] = useState([]);
  
  //stores sn and pass input fields information
  const [formData, setFormData] = useState(initialFormState);

  //stores user information
  const [userState, setUserState] = useState(initialUserState);

  //calls auth to get user information
  Auth.currentUserInfo().then(data => setUserData(data));
  
  //saves user information in userState
  async function setUserData(data){
    userState.username = data.username;
    console.log('userstate username: ' + userState.username);
    //var username = data.username;
    //console.log(username);
  }

  //device list
  useEffect(() => {
    getUserDevices();
  }, []);

  async function getUserDevices() {
  }

  /*
  * Checks if serial number or password field is null
  * Checks if serial number exists in Device table
  * Checks if password matches the serial number in Device table
  */
  async function getDeviceButton() {
    
    if (!formData.sn || !formData.pass)
    {
      console.log("sn or pass is null");
      return;
    }

    const apiData = await API.graphql(graphqlOperation(queries.getDevice, {id: formData.sn}));

    if(!apiData.data.getDevice){
      console.log('SN: ' + formData.sn + ' does not exist');
      return;
    }

    if(apiData.data.getDevice.password === formData.pass)
    {

      console.log('SN: ' + formData.sn + ' Added to user');
      addDeviceToUser();
      return;
    }
    else{
      console.log('Invalid password');
    }
  }
  /*
  * Adds the Device serial number to User device list
  * Adds the User username to Device users
  */
 
  async function addDeviceToUser(){

    const updateDeviceList = {
      //id: userState.username,
      //input: 'rmoraes2',
      username: 'rmoraes2',
      firstName: 'testname'
      //deviceList: [...deviceList, formData.sn]
      //deviceList: [...deviceList, 'test']
    };
    console.log('updateDeviceList: ' + updateDeviceList.id + ' ' + updateDeviceList.firstname);
    const apiData = await API.graphql(graphqlOperation(mutations.updateUser, {input: updateDeviceList}));
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