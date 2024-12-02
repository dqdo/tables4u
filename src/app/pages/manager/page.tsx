'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import axios from "axios";
import { stat } from "fs";


// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
  baseURL: 'https://xx0uqht4q7.execute-api.us-east-2.amazonaws.com/12'
});

export default function Home() {
  const [redraw, forceRedraw] = React.useState(0)
  const [openTime, setOpenTime] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [tableIdNumber, setTableIdNumber] = useState('');
  const [tableList, setTableList] = useState<{ restaurant_id: number; table_id: number; table_number: number; seats: number }[]>([]);
  const [openTimeDisp, setOpenTimeDisp] = useState('');
  const [closeTimeDisp, setCloseTimeDisp] = useState('');
  const [restaurantNameDisp, setRestaurantNameDisp] = useState('');
  const [restaurantLocationDisp, setRestaurantLocationDisp] = useState('');
  const [rid, setRestaurantID] = useState<number | null>(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantLocation, setRestaurantLocation] = useState('');
  const router = useRouter();


  function andRefreshDisplay() {
    forceRedraw(redraw + 1)
  }

  const handleSignout = () => {
    router.push("/")
  };

  useEffect(() => {
    const savedRestaurantID = localStorage.getItem('restaurantID');
    if (savedRestaurantID) {
      setRestaurantID(parseInt(savedRestaurantID, 10));
    }
  }, []);

  useEffect(() => {
    setRestaurantName(restaurantNameDisp);
    setRestaurantLocation(restaurantLocationDisp);
  }, [restaurantNameDisp, restaurantLocationDisp]);


  function editRestaurant(restaurantName: string, restaurantLocation: string, openTime: number, closeTime: number, restaurantId: number) {
    instance.post('/restaurants/editRestaurant2', { newName: restaurantName, newLocation: restaurantLocation, newOpenTime: openTime, newCloseTime: closeTime, restaurant_id: restaurantId })
      .then(function (response) {
        let status = response.data.statusCode;
        if (status == 200) {
          console.log("Edited restaurant")
        }
        andRefreshDisplay()
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  function createTable(restaurantId: number, seats: number, tableNumber: number) {
    instance.post('/restaurant_tables/createTable', { restaurant_id: restaurantId, seats: seats, table_number: tableNumber })
      .then(function (response) {
        let status = response.data.statusCode;
        if (status == 200) {
          console.log("Created table " + tableIdNumber + " for restaurant " + restaurantId + " with " + seats + " seats")
        }
        andRefreshDisplay()
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  function editSeatNumber(tableId: number, seats: number, availability: string) {
    instance.post('/restaurant_tables', { table_id: tableId, seats: seats, availability: availability })
      .then(function (response) {
        let status = response.data.statusCode;
        if (status == 200) {
          console.log("Edited table: " + rid + " - seats: " + seats)
        }
        andRefreshDisplay()
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  function deleteRestaurant(): void {
    instance.post('/restaurants/deleted_restaurants', { restaurant_id: rid })
      .then(function (response) {
        let status = response.data.statusCode;

        if (status == 200) {

          console.log("Deleted restaurant: " + rid)
        }
        andRefreshDisplay();
        handleSignout();
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  function activateRestaurant(): void {
    instance.post('/restaurants/active_restaurants', { restaurant_id: rid })
      .then(function (response) {
        let status = response.data.statusCode;

        if (status == 200) {
          console.log("Activated restaurant: " + rid)
        }
        andRefreshDisplay();
        handleSignout();
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  function retrieveTableList(rid: Number): void {
    instance.post('/restaurant_tables/get_tables', { restaurant_id: rid })
      .then(function (response) {

        let status = response.data.statusCode;

        if (status === 200) {
          const restaurants = response.data.tables.map((con: any) => ({
            restaurant_id: con.restaurant_id,
            table_id: con.table_id,
            table_number: con.table_number,
            seats: con.seats

          }));
          setTableList(restaurants);
        }
        andRefreshDisplay();
      })
      .catch(function (error) {

        console.log(error);
        return ""
      });
  }

  function retrieveRestaurant(rid: number) {
    instance.get('/restaurants')
      .then(function (response) {
        let status = response.data.statusCode;
        let rest_name
        if (status == 200) {
          for (let con of response.data.constants) {
            if (rid == con.restaurant_id) {
              rest_name = con.restaurant_name
              setCloseTimeDisp(con.close_time)
              setOpenTimeDisp(con.open_time)
              setRestaurantLocationDisp(con.restaurant_location)
              setRestaurantNameDisp(con.restaurant_name)
              return ""
            }
          }
          andRefreshDisplay();
        }
        return ""
      })
      .catch(function (error) {
        console.log(error);
        return ""
      });
  }


  return (
    <div>
      <div>Your ID is: {rid} </div>
      <div className="editRestaurantContainer">
        <label>Edit Restaurant</label>
        <hr style={{ border: '1px solid black', width: '100%' }} />
        Name: <input className="text" value={restaurantName} onChange={(e) => {
          setRestaurantName(e.target.value);

        }} />
        Location: <input className="text" value={restaurantLocation} onChange={(e) => {
          setRestaurantLocation(e.target.value);
        }} />
        Open Time: <input className="text" value={openTime} onChange={(e) => {
          const value = e.target.value;
          if (value === "" || !isNaN(Number(value))) {
            setOpenTime(value);
          }
        }} />
        Close Time: <input className="text" value={closeTime} onChange={(e) => {
          const value = e.target.value;
          if (value === "" || !isNaN(Number(value))) {
            setCloseTime(value);
          }
        }} />
        <button className="button" onClick={() => editRestaurant(restaurantName, restaurantLocation, Number(openTime), Number(closeTime), Number(rid))} >Edit Restaurant</button>
        <button className="button" onClick={activateRestaurant}> Activate Restaurant</button>
        <button className="button" onClick={deleteRestaurant}> Delete Restaurant</button>

        <hr style={{ border: '1px solid black', width: '100%' }} />
        <label> Create Table </label>
        <hr style={{ border: '1px solid black', width: '100%' }} />
        Table Number: <input className="text" value={tableNumber} onChange={(e) => {
          const value = e.target.value;
          if (value === "" || !isNaN(Number(value))) {
            setTableNumber(value);
          }
        }} />

        Number of Seats: <input className="text" value={seatNumber} onChange={(e) => {
          const value = e.target.value;
          if (value === "" || !isNaN(Number(value))) {
            setSeatNumber(value);
          }
        }} />

        <button className="button" onClick={() => createTable(Number(rid), Number(seatNumber), Number(tableNumber))} >Create a Table</button>
        <hr style={{ border: '1px solid black', width: '100%' }} />
        <label> Edit Number of Seats for a Table </label>
        <hr style={{ border: '1px solid black', width: '100%' }} />
        Table ID: <input className="text" value={tableIdNumber} onChange={(e) => {
          const value = e.target.value;
          if (value === "" || !isNaN(Number(value))) {
            setTableIdNumber(value);
          }
        }} />

        <button className="button" onClick={() => editSeatNumber(Number(tableIdNumber), Number(seatNumber), "available")} >Edit Number of Seats</button>
        <button className="button" onClick={handleSignout}>Sign Out</button>


      </div>

      <label className="tables">
        Table List:
        <hr style={{ border: '1px solid black', width: '100%' }} />
        {tableList.map((tableList) => (
          <div key={tableList.table_id}>
            Table ID: {tableList.table_id} | Seats: {tableList.seats} | Table Number: {tableList.table_number}
          </div>
        ))}
      </label>

      <div className="restaurantInfoContainer">
        <label style={{margin: '5px'}}> Restaurant Information </label>
        <hr style={{ border: '1px solid black', width: '100%' }} />
        <label className="name">{"Name: " + restaurantNameDisp}</label>
        <label className="location">{"Location: " + restaurantLocationDisp}</label>
        <label className="close">{"Open Time: " + closeTimeDisp}</label>
        <label className="open">{"Close Time: " + openTimeDisp}</label>
      </div>

      <label className="function">{"" + retrieveRestaurant(Number(rid))}</label>
      <label className="function">{"" + retrieveTableList(Number(rid))}</label>
    </div>

  );
}