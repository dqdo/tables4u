'use client'

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { Restaurant } from '../model'

import axios from "axios";


// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
  baseURL: 'https://xx0uqht4q7.execute-api.us-east-2.amazonaws.com/12'
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
        <label htmlFor={`${role}EmailAddress`}>ID: </label>
        <input id={`${role}EmailAddress`} type="email" style={{ borderColor: 'black', borderWidth: '2px', borderStyle: 'solid' }} placeholder="email@address.com" />
      </div>
      <div className="passwordContainer">
        <label htmlFor={`${role}Password`}>Password: </label>
        <input id={`${role}passsword`} type="password" style={{ borderColor: 'black', borderWidth: '2px', borderStyle: 'solid' }} placeholder="password" />
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
  const [constants, setConstants] = React.useState('')   // state from the AWS API
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantLocation, setRestaurantLocation] = useState('');
  const [RetrieveRestaurant, setRetrieveRestaurant] = useState('');
  const [restaurantNameList, setRestaurantNameList] = useState<string[]>([]);
  // Whenever 'redraw' changes (and there are no loaded constants) this fetches from API
  React.useEffect( () => {
    if (!constants) {
      retrieveConstants(setConstants)
      console.log("constants:", constants)
    }
  }, [redraw])

  function andRefreshDisplay() {
    forceRedraw(redraw + 1)
  }




  function retrieveConstants(): string {
    let constantsString = '';
    instance.get('/restaurants')
      .then(function (response) {
        let status = response.data.statusCode;
  
        if (status == 200) {
          // Concatenate the constant names and values into a string
          for (let con of response.data.constants) {

            if(restaurantName==con.restaurant_name){
            constantsString = `password: ${con.password}    ID: ${con.restaurant_id}`; // Adjust format as needed
            }
          }
        }
       
 
      setRetrieveRestaurant(constantsString)
       return constantsString
  
      })
      .catch(function (error) {
        console.log(error);
        return ""
      });
  
  
  
    // Return the constants string
  }


  function retrieveRestaurants(): string {
    let constantsString = '';
    instance.get('/restaurants')
      .then(function (response) {
        let status = response.data.statusCode;
  
        if (status == 200) {
          // Concatenate the constant names and values into a string
          for (let con of response.data.constants) {
       
            const restaurantList = response.data.constants.filter(con => "active"==con.status).map(con => con.restaurant_name);
            
            setRestaurantNameList(restaurantList);
          }
        }
       
 
      setRetrieveRestaurant(constantsString)
       return constantsString
  
      })
      .catch(function (error) {
        console.log(error);
        return ""
      });
  
  
  
    // Return the constants string
  }








  function createConstant() {
   
    // potentially modify the model
  
    if (restaurantName && restaurantLocation) {
    
      instance.post('/restaurants', { name: restaurantName, location: restaurantLocation })
      .then(function (response) {

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
  
      <button className="button" onClick={() => retrieveRestaurants()}>List Restaurants</button>

      <h1>Create Restaurant</h1>
      name: <input className="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} />&nbsp;
      location: <input className="text" value={restaurantLocation} onChange={(e) => setRestaurantLocation(e.target.value)} />&nbsp;
      
      <button className="button" onClick={createConstant}>Create</button><p></p>    
      <label className="score">{ RetrieveRestaurant}</label>

      <label className="Title">{"restaurant List"}</label>
      <label className="Restaurants">

  {restaurantNameList.map((name, index) => (
    <div key={index}>{name}</div>
  ))}
</label>

      </div>
  );
}
