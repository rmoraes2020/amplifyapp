import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

const initialFormState = {sn: '', pass: ''}

function App() {
  return (
    <div className="App">
      <header>
	  
        <h1>Enter device 'Serial Number' and 'Password' to add device to account</h1>
		<p></p>
		
        <input
        placeholder="Serial Number"
		//value={formData.sn}
		/>
	  
		<input
        placeholder="Password"
		//value={formData.pass}
		/>
		
		<button>Add Device</button>
		
      </header>
	  
      <AmplifySignOut />
	  
    </div>
  );
}

export default withAuthenticator(App);