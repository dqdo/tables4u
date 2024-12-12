'use client'

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

import axios from "axios";

// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
  baseURL: 'https://xx0uqht4q7.execute-api.us-east-2.amazonaws.com/stage11'
});

export default function Home() {
  const [loginRole, setLoginRole] = useState<string | null>(null);;
  const [redraw, forceRedraw] = React.useState(0)
  const [constants, setConstants] = React.useState('')
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantLocation, setRestaurantLocation] = useState('');
  const [RetrieveRestaurant, setRetrieveRestaurant] = useState('');
  const [administratorPassword, setadministratorPassword] = useState('');
  const [administratorID, setadministratorID] = useState('');
  const [email, setEmail] = useState('');
  const [people, setNumPeople] = useState('');
  const [date, setDate] = useState('');
  const [restaurantId, setRestaurantId] = useState('');

  const [restaurantNameList, setRestaurantNameList] = useState<string[]>([]);

  const [managerPassword, setmanagerPassword] = useState('');
  // Whenever 'redraw' changes (and there are no loaded constants) this fetches from API
  React.useEffect(() => {
    if (!constants) {
      retrieveCredentials()
    }
  }, [redraw])

  function andRefreshDisplay() {
    forceRedraw(redraw + 1)
  }

  function retrieveCredentials() {
    let constantsString = '';
    instance.get('/restaurants')
      .then(function (response) {
        let status = response.data.statusCode;

        if (status == 200) {
          // Concatenate the constant names and values into a string
          for (let con of response.data.constants) {

            if (restaurantName == con.restaurant_name) {
              constantsString = `Password: ${con.password} | ID: ${con.restaurant_id}`; 
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
  }

  function Login({ role, closeLogin }: any) {

    const [ID, setID] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    retrieveAdministrator();

    const handleLogin = async () => {
      const result = await retrieveManager(Number(ID));


      if (role === 'Administrator' && ID == administratorID && administratorPassword == password) {
        router.push('/pages/admin');
        setadministratorID("");
        setadministratorPassword("");
      } else if (role === 'Manager' && result == password) {
        router.push(`/pages/manager`);
        localStorage.setItem('restaurantID', ID);
        setmanagerPassword("");
      }
    }

    return (
      <div className="enterCredentials">
        <label>{role} Login</label>
        <div className="emailAddressContainer">
          <label htmlFor={`${role}EmailAddress`}></label>

          ID: <input className="text" value={ID} onChange={(e) => setID(e.target.value)} />&nbsp;
        </div>
        <div className="passwordContainer">
          <label htmlFor={`${role}Password`}></label>

          Password: <input className="text" value={password} onChange={(e) => setPassword(e.target.value)} />&nbsp;
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


  async function retrieveManager(id: number) {
    try {
      const response = await instance.get('/restaurants');
      let password;
      let status = response.data.statusCode;

      if (status == 200) {
        for (let con of response.data.constants) {
          if (con.restaurant_id === id) {
            const password = con.password
            setmanagerPassword(con.password);
            return password
          }
        }
      }

    } catch (error) {
      console.error(error);
      return ""; 
    }
  }


  function retrieveAdministrator() {

    instance.get('/administrator')
      .then(function (response) {
        let status = response.data.statusCode;


        if (status == 200) {

          // Concatenate the constant names and values into a string
          for (let con of response.data.constants) {
            const restaurantID = con.ID
            const restaurantPassword = con.password

            setadministratorID(restaurantID)
            setadministratorPassword(restaurantPassword)
          }
        }

        return "Success"

      })
      .catch(function (error) {
        console.log(error);
        return ""
      });
  }

  function retrieveRestaurants() {
    let constantsString = '';
    instance.get('/restaurants')
      .then(function (response) {
        let status = response.data.statusCode;

        if (status == 200) {
          // Concatenate the constant names and values into a string
          for (let con of response.data.constants) {

            const restaurantList = response.data.constants.filter((con: { status: string; }) => "active" == con.status).map((con: { restaurant_name: any; }) => con.restaurant_name);

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
  }

  function makeReservation() {
    if (email && restaurantId && people && date) {
      instance.post('/reservations', {email: email, restaurantID: restaurantId, people: people, reservationDate: date})
        .then(function (response) {
          let status = response.data.statusCode;

          if (status == 200) {
            console.log("Created reservation")
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }

  function createRestaurant() {

    if (restaurantName && restaurantLocation) {

      instance.post('/restaurants', { name: restaurantName, location: restaurantLocation })
        .then(function (response) {
          let status = response.data.statusCode;

          if (status == 200) {
            console.log("Created restaurant")
          }
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

      <button className="button listRestaurant" onClick={() => retrieveRestaurants()}>List Restaurants</button>

      <div className="createRestaurantContainer">
      <label style={{marginLeft: '2px'}}>Create a Restaurant</label>
      <hr style={{ border: '1px solid black', width: '100%' }} />
      <label style={{marginLeft: '2px'}}>Name: </label>
      <input style={{width: "90%"}} className="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} />&nbsp;
      <label style={{marginLeft: '2px'}}>Location: </label>
      <input style={{width: "90%"}} className="text" value={restaurantLocation} onChange={(e) => setRestaurantLocation(e.target.value)} />&nbsp;
      <button style={{width: "50%"}} className="button" onClick={createRestaurant}>Create</button><p></p>
      </div>
      
      <div className = "makeReservationContainer">
      <label style={{marginLeft: '10px'}}>Make a Reservation</label>
      <hr style = {{border: '1px solid black', width: '100%'}} />
      <label style={{marginLeft: '10px'}}>Email: </label>
      <input style={{width: "90%", marginLeft: '10px'}} className="text" value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)} />&nbsp;
      <label style={{marginLeft: '10px'}}>Restaurant ID: </label>
      <input style={{width: "90%", marginLeft: '10px'}} className="text" value={email} onChange={(e) => setEmail(e.target.value)} />&nbsp;
      <label style={{marginLeft: '10px'}}>Number of People: </label>
      <input style={{width: "90%", marginLeft: '10px'}} className="text" value={people} onChange={(e) => setNumPeople(e.target.value)} />&nbsp;
      <label style={{marginLeft: '10px'}}>Date & Time: (yyyy-mm-dd hh:00:00)</label>
      <input style={{width: "90%", marginLeft: '10px'}} className="text" value={date} onChange={(e) => setDate(e.target.value)} />&nbsp;
      <button style={{width: "50%"}} className="button" onClick={makeReservation}>Create</button><p></p>
      </div>

      <label style={{margin: '5px'}} className="credentialInfo">{RetrieveRestaurant}</label>
     
      <label className="restaurantList">
      <hr style={{ border: '1px solid black', width: '100%' }} />
        {restaurantNameList.map((name, index) => (
          <div key={index}>{name}</div>
        ))}
      </label>
  

    </div>
  );
}