'use client'

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

import axios from "axios";

// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
  baseURL: 'https://xx0uqht4q7.execute-api.us-east-2.amazonaws.com/six'
});

function Login({ role, closeLogin }) {

  const router = useRouter();

  const handleLogin = () => {
    if (role === 'Administrator') {
      router.push('/pages/admin');
    } else if (role === 'Manager') {
      router.push('/pages/manager');
    }
  };

  return (
    <div className="enterCredentials">
      <label>{role} Login</label>
      <div className="emailAddressContainer">
        <label htmlFor={`${role}EmailAddress`}>E-mail Address: </label>
        <input id={`${role}EmailAddress`} type="email" style={{ borderColor: 'black', borderWidth: '2px', borderStyle: 'solid' }} placeholder="email@address.com" />
      </div>
      <div className="passwordContainer">
        <label htmlFor={`${role}Password`}>Password: </label>
        <input id={`${role}Password`} type="password" style={{ borderColor: 'black', borderWidth: '2px', borderStyle: 'solid' }} />
      </div>
      <button className="button closeLogin" onClick={closeLogin} style={{ marginRight: '50px' }}>
        Close
      </button>
      <button className="button enterLogin" onClick={handleLogin}>
        Enter
      </button>

    </div>
  );
}





export default function Home() {
  const [loginRole, setLoginRole] = useState<string | null>(null);;
  const [redraw, forceRedraw] = React.useState(0)

  function andRefreshDisplay() {
    forceRedraw(redraw + 1)
  }

  function createConstant() {
    // potentially modify the model
    let name = document.getElementById("constant-name") as HTMLInputElement
    let value = document.getElementById("constant-value") as HTMLInputElement
    if (name && value) {
      
      // Access the REST-based API and in response (on a 200 or 400) process.
      instance.post('/constants', {"name":name.value, "value":value.value})
      .then(function (response) {
        // not sure what to do ON failure?
        name.value = ''
        value.value = ''
  
  
        andRefreshDisplay()
      })
      .catch(function (error) {
        console.log(error)
      })
    }
  }
  

  const showLogin = (role: string) => {
    setLoginRole(role);
  };

  const closeLogin = () => {
    setLoginRole(null);
  };

  

  return (
    <div>
      <div className="loginButtonContainer">
        <button data-testid="loginAdministrator" className="button loginAdministrator" onClick={() => showLogin('Administrator')}>
          Login Administrator
        </button>
        <button data-testid="loginManager" className="button loginManager" onClick={() => showLogin('Manager')}>
          Login Manager
        </button>
        {loginRole && <Login role={loginRole} closeLogin={closeLogin} />}
      </div>
  

      <button className="button">List Restaurants</button>
      <h1>Create Restaurant</h1>
      name: <input className="text" id="constant-name"/>&nbsp;
      name: <input className="text" id="constant-address"/>&nbsp;
      <button className="button" onClick={(e) => createConstant()}>Create</button><p></p>

    </div>
  );
}
