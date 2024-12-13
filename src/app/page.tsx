'use client'

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

import axios from "axios";

const instance = axios.create({
  baseURL: 'https://xx0uqht4q7.execute-api.us-east-2.amazonaws.com/12'
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
  const [makeRestaurantId, setMakeRestaurantId] = useState('');
  const [restaurantSearchName, setRestaurantSearchName] = useState(0);
  const [getrestaurantSearchName, setGetRestaurantSearchName] = useState<{ restaurant_id: number; restaurant_name: string; restaurant_location: string, open_time: number, close_time: number }[]>([]);
  const [hour, setHour] = useState('');
  const [restaurantNameList, setRestaurantNameList] = useState<{ id: number; name: string }[]>([]);
  const [reservation, setReservation] = useState<{ tableNumber: number; restaurantID: number; people: number; reservationDate: string; reservationTime: number; confirmationNumber: number}[]>([]);

  const [managerPassword, setmanagerPassword] = useState('');

  React.useEffect(() => {
    if (!constants) {
      retrieveCredentials()
    }
  }, [redraw])

  function retrieveCredentials() {
    let constantsString = '';
    instance.get('/restaurants')
      .then(function (response) {
        let status = response.data.statusCode;
        if (status == 200) {
          for (let con of response.data.constants) {

            if (restaurantName == con.restaurant_name) {
              constantsString = `Password: ${con.password} | ID: ${con.restaurant_id}`;
            }
          }
        }
        setRetrieveRestaurant(constantsString)
        console.log(constantsString)
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
    }
  }


  function retrieveAdministrator() {

    instance.get('/administrator')
      .then(function (response) {
        let status = response.data.statusCode;


        if (status == 200) {

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
      });
  }

  function retrieveRestaurants() {
    instance.get('/restaurants')
      .then(function (response) {
        let status = response.data.statusCode;

        if (status === 200) {
          const restaurantList = response.data.constants
            .filter((con: any) => con.status === "active")
            .map((con: any) => ({ id: con.restaurant_id, name: con.restaurant_name }));

          setRestaurantNameList(restaurantList);
        } else {
          setRestaurantNameList([]);
        }
      })
      .catch(function (error) {
        console.error(error);
        setRestaurantNameList([]);
      });
  }

      // if (!email || !makeRestaurantId || !people || !date || !hour) {
    //   console.log("All fields are required to make a reservation.");
    //   return;
    // }
  
    // const [year, month, day] = date.split("-").map(Number);
    // if (!year || !month || !day) {
    //   console.log("Invalid date format. Please use yyyy-mm-dd.");
    //   return;
    // }
  
    // const reservationDate = new Date(year, month - 1, day); // Adjust month (0-indexed)
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
  
    // if (reservationDate < today) {
    //   console.log("The reservation date cannot be in the past.");
    //   return;
    // }

  function makeReservation(date: string, rid: number, time: number, r_email: string, n_people: number) {
    console.log(date)
    console.log(rid)
    console.log(time)
    console.log(r_email)
    console.log(n_people)
    instance.post('/make_reservation', { restaurantID: rid, reservationDate: date, reservationTime: time, email: r_email, people: n_people })
    .then((response) => {
      const { statusCode, result, error } = response.data;
      console.log(response.data)
      // if (statusCode === 200) {
      //   const reservations = result.reservations;
      //   if (reservations.length > 0) {
      //     const reservationInfo = reservations.map((con: any) => ({
      //       table_number: con.table_number,
      //       confirmation_number: con.confirmation_number,
      //       table_id: con.table_id,
      //       email: con.email,
      //       restaurant_date: con.restaurant_date,
      //       numPeople: con.numPeople,
      //     }));
      //   }
      // }
    })
    .catch((error) => {
      console.log("Error making restaurant:", error);
    });
  }
  

  function getSpecificRestaurant() {
    if (!restaurantSearchName) {
      console.log("Please provide a valid restaurant ID or name to search.");
      return;
    }
    instance.post('/restaurants/get-specific-restaurant', { restaurantId: restaurantSearchName })
      .then((response) => {
        const { statusCode, result, error } = response.data;
        console.log(response.data)
        if (statusCode === 200) {
          const restaurants = result.restaurants;
          if (restaurants.length > 0) {
            const restaurantSpecific = restaurants.map((con: any) => ({
              restaurant_id: con.restaurant_id,
              restaurant_name: con.restaurant_name,
              restaurant_location: con.restaurant_location,
              open_time: con.open_time,
              close_time: con.close_time,
            }));
            setGetRestaurantSearchName(restaurantSpecific);
          }
        }
      })
      .catch((error) => {
        console.log("Error fetching restaurant:", error);
      });
  }


  function createRestaurant() {

    if (restaurantName && restaurantLocation) {

      instance.post('/restaurants', { name: restaurantName, location: restaurantLocation })
        .then(function (response) {
          let status = response.data.statusCode;

          if (status == 200) {
            console.log("Created restaurant")
            retrieveCredentials();
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
        <label style={{ marginLeft: '2px' }}>Create a Restaurant</label>
        <hr style={{ border: '1px solid black', width: '100%' }} />
        <label style={{ marginLeft: '2px' }}>Name: </label>
        <input style={{ width: "90%" }} className="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} />&nbsp;
        <label style={{ marginLeft: '2px' }}>Location: </label>
        <input style={{ width: "90%" }} className="text" value={restaurantLocation} onChange={(e) => setRestaurantLocation(e.target.value)} />&nbsp;
        <button style={{ width: "50%" }} className="button" onClick={createRestaurant}>Create</button><p></p>
      </div>

      <div className="makeReservationContainer">
        <label style={{ marginLeft: '10px' }}>Make a Reservation</label>
        <hr style={{ border: '1px solid black', width: '100%' }} />
        <label style={{ marginLeft: '10px' }}>Email: </label>
        <input style={{width: "90%", marginLeft: '10px'}} className="text" value={email} onChange={(e) => setEmail(e.target.value)} />&nbsp;
        <label style={{ marginLeft: '10px' }}>Restaurant ID: </label>
        <input style={{ width: "90%", marginLeft: '10px' }} min="1" max="8" className="text" value={makeRestaurantId} onChange={(e) => {
          const value = e.target.value;
          if (value === "" || (Number(value) >= 1)) {
            setMakeRestaurantId(value);
          }
        }} />&nbsp;
        <label style={{ marginLeft: '10px' }}>Number of People: </label>
        <input style={{ width: "90%", marginLeft: '10px' }} min="1" max="8" className="text" value={people} onChange={(e) => {
          const value = e.target.value;
          if (value === "" || (Number(value) >= 1 && Number(value) <= 8)) {
            setNumPeople(value);
          }
        }} />&nbsp;
        <label style={{ marginLeft: '10px' }}>Date: (yyyy-mm-dd)</label>
        <input style={{ width: "90%", marginLeft: '10px' }} className="text" value={date} onChange={(e) => setDate(e.target.value)} />&nbsp;
        <label style={{ marginLeft: '10px' }}>Hour: (0-23)</label>
        <input style={{ width: "90%", marginLeft: '10px' }} min="0" max="23" className="text" value={hour} onChange={(e) => {
          const value = e.target.value;
          if (value === "" || (Number(value) >= 0 && Number(value) <= 23)) {
            setHour(value);
          }
        }} />&nbsp;
        <button style={{ width: "50%" }} className="button" onClick={() => makeReservation(date, Number(makeRestaurantId), Number(hour), email, Number(people))}>Create</button><p></p>
      </div>

      <label style={{ margin: '5px' }} className="credentialInfo">{RetrieveRestaurant}</label>

      <label className="restaurantList">
        <hr style={{ border: '1px solid black', width: '100%' }} />
        {restaurantNameList.map((restaurant) => (
          <div key={restaurant.id}>
            ID: {restaurant.id} | Name: {restaurant.name}
          </div>
        ))}
      </label>


      <div className="findRestaurantContainer">
        Search Restaurant: <input
          className="text"
          value={restaurantSearchName || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (!isNaN(Number(value)) || value === '') {
              setRestaurantSearchName(Number(value));
            }
          }}
        />

        <button data-testid="searchRestaurant" className="button searchRestaurant" onClick={() => getSpecificRestaurant()}>
          Search
        </button>

        <label className="restaurantSpecific">
          <hr style={{ border: '1px solid black', width: '100%' }} />
          {Array.isArray(getrestaurantSearchName) && getrestaurantSearchName.length > 0 ? (
            getrestaurantSearchName.map((search) => (
              <div key={search.restaurant_id}>
                Restaurant ID: {search.restaurant_id} | Restaurant Name: {search.restaurant_name} | Location: {search.restaurant_location} | Open Time {search.open_time}:00:00 | {search.close_time}:00:00
              </div>
            ))
          ) : (
            <div>No results found for the given Restaurant ID.</div>
          )}
        </label>

      </div>

      <label className="reservationInfo">
  <hr style={{ border: "1px solid black", width: "100%" }} />
  {reservation.length > 0 ? (
    reservation.map((res) => (
      <div key={res.confirmationNumber}>
        <p>Confirmation Number: {res.confirmationNumber}</p>
      </div>
    ))
  ) : (
    <p>No reservations yet.</p>
  )}
</label>

    </div>
  );
}