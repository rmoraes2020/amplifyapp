import React, { useState, useEffect } from 'react';
import './App.css';
import { API, graphqlOperation, Auth, AWSKinesisFirehoseProvider } from 'aws-amplify';
import * as mutations from './graphql/mutations';
import * as queries from './graphql/queries';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import AWS from 'aws-sdk';
import {Paper, responsiveFontSizes} from '@material-ui/core';
import { render } from '@testing-library/react';

const documentClient = new AWS.DynamoDB.DocumentClient();

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
    //setUserState(userState => [data.username])
  }

  //device list
  useEffect(() => {
    getUserDevices();
  }, []);

  async function getUserDevices() {
    const apiData = await API.graphql({ query: queries.listDevices });
    setUserDevices(apiData.data.listDevices.items);
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
      addDeviceToUser();
      return;
    }
    else{
      console.log('Invalid password');
    }
  }

  async function addDeviceToUser(){

    //Gets the user device list
    const apiUserData = await API.graphql(graphqlOperation(queries.getUser, {id: userState.username}));
    const userDeviceList = apiUserData.data.getUser.deviceList;
    console.log('user device list: ' + userDeviceList);

    //adds the new device to the user device list
    const updateDeviceList = {
      id: userState.username,
      deviceList: documentClient.createSet([...userDeviceList, formData.sn])
    };
    console.log('updateDeviceList: ' + updateDeviceList.id + ' ' + updateDeviceList.deviceList);

    //adds user to device user list
    addUserToDevice();

    //checks if the user device list already contains the new device
    if(userDeviceList.includes(formData.sn)){
      console.log(userState.username + " already contains device " + formData.sn);
    }
    else{
      console.log(formData.sn + ' Added to user');
      const apiData = await API.graphql(graphqlOperation(mutations.updateUser, {input: updateDeviceList}));
      
    }
    
  }
  
  async function addUserToDevice() {
    
    //Gets the device user list
    const apiDeviceData = await API.graphql(graphqlOperation(queries.getDevice, {id: formData.sn}));
    const deviceUserList = apiDeviceData.data.getDevice.userList;
    console.log('user device list: ' + deviceUserList);

    //adds the new user to the device user list
    const updateUserList = {
      id: formData.sn,
      userList: documentClient.createSet([...deviceUserList, userState.username])
    };

    //checks if device user list already contains new user
    if(deviceUserList.includes(userState.username)){
      console.log(formData.sn + "already contains user" + userState.username);
    }
    else{
      console.log(userState.username + "added to user");
      const apiData = await API.graphql(graphqlOperation(mutations.updateDevice, {input: updateUserList}));
    }

  }

  function refreshPage() {
    //window.location.reload(false);

  }
  


  return (
    <div className="App">

      <h1>DigiCloud App</h1>
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

      <div className="deviceList">
      {
        userDevices.map(Device =>
          (
            <div key={Device.id}>
              {
                Device.userList.includes(userState.username) &&
                  <Paper variant="outlined" elevation={2}>
                    <div className="deviceCard">
                      <div className="deviceSN">{Device.id}</div>
                      <div className="deviceStatus">{Device.status}</div>
                      <div className="deviceDueAt">{Device.dueAt}</div>
                    </div>
                  </Paper>
                }
                
            </div>
          )
        )}
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);