'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import{useSearchParams}from 'next/navigation';

import axios from "axios";


// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
  baseURL: 'https://xx0uqht4q7.execute-api.us-east-2.amazonaws.com/12'
});

export default function Home() {
    const [redraw, forceRedraw] = React.useState(0)
    const [restaurantName, setRestaurantName] = useState('');
    const [restaurantLocation, setRestaurantLocation] = useState('');
    const [openTime, setOpenTime] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const [seatNumber, setSeatNumber] = useState('');
    const [closeTime, setCloseTime] = useState('');
    const [tableIdNumber, setTableIdNumber] = useState('');
    const [tableList, setTableList] = useState<{restaurant_id: number; table_id: number; table_number: number; seats: number}[]>([]);
    const [openTimeDisp, setOpenTimeDisp] = useState('');
    const [closeTimeDisp, setCloseTimeDisp] = useState('');
    const [restaurantNameDisp, setRestaurantNameDisp] = useState('');
    const [restaurantLocationDisp, setRestaurantLocationDisp] = useState('');
    const [rid, setRestaurantID] = useState<number | null>(null);

    function andRefreshDisplay() {
      forceRedraw(redraw + 1)
    }

    const router = useRouter();

    const handleSignout = () => {
        router.push("/..")
    };

    useEffect(() => {
      const savedRestaurantID = localStorage.getItem('restaurantID');
      if (savedRestaurantID) {
        setRestaurantID(parseInt(savedRestaurantID, 10)); 
      }
    }, []);


    function editRestaurant(restaurantName, restaurantLocation, openTime, closeTime, restaurantId) {
      
        
          instance.post('/restaurants/editRestaurant2', { newName: restaurantName, newLocation: restaurantLocation, newOpenTime : openTime, newCloseTime : closeTime, restaurant_id : restaurantId})
          .then(function (response) {
            andRefreshDisplay()
          })
          .catch(function (error) {
            console.log(error)
          })
      }

      function createTable (restaurantId, seats, tableNumber) {
        instance.post('/restaurant_tables/createTable', { restaurant_id : restaurantId, seats : seats, table_number : tableNumber})
          .then(function (response) {
            andRefreshDisplay()
          })
          .catch(function (error) {
            console.log(error)
          })
      }
      function editSeatNumber (tableId, seats, availability) {
        instance.post('/restaurant_tables', { table_id: tableId, seats : seats, availability : availability})
          .then(function (response) {
            andRefreshDisplay()
          })
          .catch(function (error) {
            console.log(error)
          })
      }

      function deleteRestaurant(): void {
        instance.post('/restaurants/deleted_restaurants', { restaurant_id: rid })
            .then(function (response) {
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
          andRefreshDisplay();
          handleSignout();
      })
      .catch(function (error) {
          console.log(error)
      })
    }

    function retrieveTableList(rid): void {
        
      instance.post('/restaurant_tables/get_tables', { restaurant_id: rid })
          .then(function (response) {
              
              let status = response.data.statusCode;
               
              if (status === 200) {
               
                  const restaurants = response.data.tables.map((con: any) => ({ 
                      
                      restaurant_id: con.restaurant_id,
                      table_id:con.table_id,
                      table_number: con.table_number,      
                      seats: con.seats
                      
                  }));
               
             
                  setTableList(restaurants);

                  andRefreshDisplay();
              }
          })
          .catch(function (error) {
            
              console.log(error);
              return ""
            });

  }


  function RetrieveRestaurant(rid){
      instance.get('/restaurants')
        .then(function (response) {
          let status = response.data.statusCode;
    let rest_name
          if (status == 200) {
            // Concatenate the constant names and values into a string
            for (let con of response.data.constants) {
  
              if(rid==con.restaurant_id){
                 rest_name=con.restaurant_name
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
            <h1>Edit Restaurant</h1>
            name: <input className="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} />
            location: <input className="text" value={restaurantLocation} onChange={(e) => setRestaurantLocation(e.target.value)} />
            Open Time: <input className="text" value={openTime} onChange={(e) =>  {
                    const value = e.target.value;
                    if (value === "" || !isNaN(Number(value))) {
                        setOpenTime(value);
                    }
                }} />
            Close Time: <input className="text" value={closeTime} onChange={(e) =>  {
                    const value = e.target.value;
                    if (value === "" || !isNaN(Number(value))) {
                        setCloseTime(value);
                    }
                }} />
            <button className="button" onClick= {() => editRestaurant(restaurantName, restaurantLocation, openTime, closeTime, rid)} >Edit Restaurant</button>

            Table Number: <input className="text" value={tableNumber} onChange={(e) =>  {
                    const value = e.target.value;
                    if (value === "" || !isNaN(Number(value))) {
                        setTableNumber(value);
                    }
                }} />

    <button className="button" onClick= {() => createTable(rid, seatNumber, tableNumber)} >Create a Table</button>

            Number of Seats: <input className="text" value={seatNumber} onChange={(e) =>  {
                    const value = e.target.value;
                    if (value === "" || !isNaN(Number(value))) {
                        setSeatNumber(value);
                    }
                }} />
            
            TableId: <input className="text" value={tableIdNumber} onChange={(e) =>  {
                    const value = e.target.value;
                    if (value === "" || !isNaN(Number(value))) {
                        setTableIdNumber(value);
                    }
                }} />
            <button className="button" onClick= {() => editSeatNumber(tableIdNumber, seatNumber, "available")} >Edit Number of Seats</button>
            <button className="button" onClick={handleSignout}>Sign Out</button>
            <button className="button" onClick={activateRestaurant}> Activate Restaurant</button>
            <button className="button" onClick={deleteRestaurant}> Delete Restaurant</button>

            <label className="Tables">
                Table List:
                {tableList.map((tableList) => (
                    <div key={tableList.table_id}>
                        tableid: {tableList.table_id}    seats: {tableList.seats}  tableNumber: {tableList.table_number}
                    </div>
                ))}
            </label>

            <h1>  Restaurant</h1>
            <label className="name">{"name: "+restaurantNameDisp}</label>
            <label className="location">{"location: "+restaurantLocationDisp}</label>
            <label className="close">{"Open Time: "+closeTimeDisp}</label>
           <label className="open">{"Close Time: "+openTimeDisp}</label>

           
           <label className="function">{""+RetrieveRestaurant(rid)}</label>
            <label className="function">{""+retrieveTableList(rid)}</label>
        </div>

        
    
    );
}