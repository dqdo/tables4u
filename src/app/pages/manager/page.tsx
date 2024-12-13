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
  const [totalSeats, setTotalSeats] = useState(0);
  const [usedSeats, setUsedSeats] = useState(0);
  const router = useRouter();
  const [status, setStatus] = useState('');
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [close_date, setClosedDate] = useState("");
  const [list_closed_dates, setListClosedDates] = useState<{ id: number, restaurant_id: number; restaurant_date: any }[]>([]);
  const [availabilityReport, setAvailabilityReport] = useState<{ overallUtil: string; avgAvailability: string }[]>([]);



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
    if (rid) {
      retrieveRestaurant(rid);
      retrieveTableList(rid);
      getClosedDays(rid)
    }
  }, [rid]);

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
        retrieveRestaurant(restaurantId)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  function createTable(restaurantId: number, seats: number, tableNumber: number) {
    if (!tableNumber || !seats) {
      console.log("Please enter both table number and seats")
      return;
    }

    instance.post('/restaurant_tables/createTable', { restaurant_id: restaurantId, seats: seats, table_number: tableNumber })
      .then(function (response) {
        let status = response.data.statusCode;
        if (status == 200) {
          console.log("Created table " + tableIdNumber + " for restaurant " + restaurantId + " with " + seats + " seats")
        }
        retrieveTableList(restaurantId);
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  function editSeatNumber(tableId: number, seats: number, restaurantId: number) {
    instance.post('/restaurant_tables', { table_id: tableId, seats: seats, restaurant_id: restaurantId })
      .then(function (response) {
        let status = response.data.statusCode;
        if (status == 200) {
          console.log("Edited table: " + rid + " - seats: " + seats)
        }
        retrieveTableList(restaurantId)
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
        handleSignout();
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  function retrieveTableList(rid: number): void {
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
      })
      .catch(function (error) {

        console.log(error);
        return ""
      });
  }


  function getClosedDays(rid: number) {
    instance.post('/close_days/get_closed_days', { restaurant_id: rid })
      .then(function (response) {
        let status = response.data.statusCode;
        if (status === 200) {
          const r_closed_dates = response.data.restaurant_date.map((con: any) => {
            const validDate = new Date(con.restaurant_date);
            const displayDate = validDate.toISOString().split('T')[0];
            return {
              restaurant_id: con.restaurant_id,
              restaurant_date: displayDate
            };
          });
          setListClosedDates(r_closed_dates);
        }
      })
      .catch(function (error) {
        console.log(error);
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
              setStatus(con.status)
              return ""
            }
          }
        }
        return ""
      })
      .catch(function (error) {
        console.log(error);
        return ""
      });
  }

  const generateOptions = (start: any, end: any) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  const setDate = () => {
    if (!year || !month || !day) {
      console.log("Please select a valid year, month, and day.");
      return;
    }
    const date = new Date(`${year}-${month}-${day}`);

    if (
      date.getFullYear() !== parseInt(year) ||
      date.getMonth() + 1 !== parseInt(month) ||
      date.getDate() !== parseInt(day)
    ) {
      console.log("Invalid date. Please enter a valid year, month, and day.");
      return;
    }
    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    setClosedDate(formattedDate);
    console.log("Date: " + formattedDate)
  };

  function closeFutureDay(close_date: string) {
    if (!year || !month || !day) {
      console.log("Please select a valid year, month, and day.");
      return;
    }

    const date = new Date(`${year}-${month}-${day}`);
    if (
      date.getFullYear() !== parseInt(year) ||
      date.getMonth() + 1 !== parseInt(month) ||
      date.getDate() !== parseInt(day)
    ) {
      console.log("Invalid date. Please enter a valid year, month, and day.");
      return;
    }

    instance.post('/close_days', { restaurant_date: close_date, restaurant_id: rid })
      .then(function (response) {
        let status = response.data.statusCode;
        if (status == 200) {
          console.log("Closed on: " + close_date)
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  function openFutureDay(close_date: string) {
    if (!year || !month || !day) {
      console.log("Please select a valid year, month, and day.");
      return;
    }

    const date = new Date(`${year}-${month}-${day}`);

    if (
      date.getFullYear() !== parseInt(year) ||
      date.getMonth() + 1 !== parseInt(month) ||
      date.getDate() !== parseInt(day)
    ) {
      console.log("Invalid date. Please enter a valid year, month, and day.");
      return;
    }

    instance.post('/close_days/open_days', { restaurant_date: close_date, restaurant_id: rid })
      .then(function (response) {
        let status = response.data.statusCode;
        if (status == 200) {
          console.log("Opened on: " + close_date)
        }
      })
      .catch(function (error) {
        console.log(error)
      })

  }

  function reviewDaysAvailability(rid: number, date: string) {
    console.log(rid);
    console.log(date);
    instance
      .post('/reservations/reviewDaysAvailability', { restaurant_id: rid, restaurant_date: date })
      .then(function (response) {
        const status = response.data.statusCode;
        if (status === 200) {
          const { averageAvailability, overallUtilization } = response.data.result.summary;
          setAvailabilityReport([{
            avgAvailability: averageAvailability,
            overallUtil: overallUtilization
          }]);
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  }



  return (
    <div>
      <div className="id">Your ID is: {rid} </div>
      <div className="editRestaurantContainer">
        <label>Edit Restaurant</label>
        <hr style={{ border: '1px solid black', width: '100%' }} />

        {status === 'active' ? (
          <p>Restaurant is active. Editing and table management are disabled.</p>) : (
          <>
            Name: <input className="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} />
            Location: <input className="text" value={restaurantLocation} onChange={(e) => setRestaurantLocation(e.target.value)} />
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
            <button className="button" onClick={() => editRestaurant(restaurantName, restaurantLocation, Number(openTime), Number(closeTime), Number(rid))}>Edit Restaurant</button>
            <button className="button" onClick={activateRestaurant}>Activate Restaurant</button>
            <button className="button" onClick={deleteRestaurant}>Delete Restaurant</button>

            <hr style={{ border: '1px solid black', width: '100%' }} />
            <label>Create Table</label>
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

            <button className="button" onClick={() => createTable(Number(rid), Number(seatNumber), Number(tableNumber))}>Create a Table</button>
            <hr style={{ border: '1px solid black', width: '100%' }} />
            <label>Edit Number of Seats for a Table</label>
            Table ID: <input className="text" value={tableIdNumber} onChange={(e) => {
              const value = e.target.value;
              if (value === "" || !isNaN(Number(value))) {
                setTableIdNumber(value);
              }
            }} />
            <button className="button" onClick={() => editSeatNumber(Number(tableIdNumber), Number(seatNumber), Number(rid))}>Edit Number of Seats</button>
          </>
        )}
        <button className="button" onClick={deleteRestaurant}> Delete Restaurant</button>
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


      <label className="availabilityReport">
        <hr style={{ border: '1px solid black', width: '100%' }} />
        {availabilityReport.map((report) => (
          <div key={report.avgAvailability}>
            Availibility Report | Average Availability: {report.avgAvailability} | Overall Utilization: {report.overallUtil}
          </div>
        ))}
      </label>

      <label className="closed_dates">
        Closed Days:
        <hr style={{ border: '1px solid black', width: '100%' }} />
        {list_closed_dates.map((list_closed_dates) => (
          <div key={list_closed_dates.restaurant_date}>
            {list_closed_dates.restaurant_date}
          </div>
        ))}
      </label>

      <div className="restaurantInfoContainer">
        <label style={{ margin: '5px' }}> Restaurant Information </label>
        <hr style={{ border: '1px solid black', width: '100%' }} />
        <label className="name">{"Name: " + restaurantNameDisp}</label>
        <label className="location">{"Location: " + restaurantLocationDisp}</label>
        <label className="close">{"Close Time: " + closeTimeDisp}</label>
        <label className="open">{"Open Time: " + openTimeDisp}</label>
        <label className="status">{"Status: " + status}</label>
      </div>

      <div className="dateInputContainer">
        <form className="dateInput" onSubmit={(e) => e.preventDefault()}>
          <label>Set Date: {close_date} </label>
          <label>
            Year:
            <select className="button" value={year} onChange={(e) => setYear(e.target.value)} required>
              <option value="" disabled>
                Select Year
              </option>
              {generateOptions(2024, 2050)}
            </select>
          </label>
          <label>
            Month:
            <select className="button" value={month} onChange={(e) => setMonth(e.target.value)} required>
              <option value="" disabled>
                Select Month
              </option>
              {generateOptions(1, 12)}
            </select>
          </label>
          <label>
            Day:
            <select className="button" value={day} onChange={(e) => setDay(e.target.value)} required>
              <option value="" disabled>
                Select Day
              </option>
              {generateOptions(1, 31)}
            </select>
          </label>
          <button className="button" onClick={setDate}>
            Set Date
          </button>
          <button className="button" onClick={() => closeFutureDay(close_date)}>
            Close Future Day
          </button>
          <button className="button" onClick={() => openFutureDay(close_date)}>
            Open Future Day
          </button>
          {status === 'active' && (
            <button className="button" onClick={() => reviewDaysAvailability(Number(rid), close_date)}>
              Review Day&apos;s Availability
            </button>
          )}
        </form>
      </div>
    </div>

  );
}