'use client'

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

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
    </div>
  );
}
