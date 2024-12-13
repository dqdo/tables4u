'use client'

import React, { Suspense, useState } from "react";
import { useRouter } from 'next/navigation';

import axios from "axios";
import { list } from "postcss";


// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
    baseURL: 'https://xx0uqht4q7.execute-api.us-east-2.amazonaws.com/12'
});




export default function Home() {
    const [redraw, forceRedraw] = React.useState(0)
    const [restaurantList, setRestaurantList] = useState<{ id: number; name: string }[]>([]);
    const [restaurantDateList, setRestaurantDateList] = useState<{ id: number;  open_time: number; close_time:number }[]>([]);
    const [reportList, setReportList] = useState<{ date: string;  utilization: number; availability:number }[]>([]);
    const [reservationList, setReservationList] = useState<{ table_id: number; date: string,seats:number }[]>([]);
    const [tableList, setTableList] = useState<{ restaurant_id: number;  table_id: number, table_number: number, seats:number }[]>([]);
    const [restaurantID, setRestaurantID] = useState<number | string>("");
    const [restaurantIDforReport, setRestaurantIDforReport] = useState<number | string>("");
    const [start_date, setStartDate] = useState<string | string>("");
    const [confirmationNum, setConfirmationNum] = useState<string | string>("");
    const [email, setEmail] = useState<number | string>("");
    const [end_date, setendDate] = useState<string | string>("");
    const router = useRouter();



    type Avail = {
        date: string;
        utilization: number;
        availability: number;
      };
      

    function andRefreshDisplay() {
        forceRedraw(redraw + 1)
    }

    const handleSignout = () => {
        router.push("/")
    };

    function retrieveRestaurants(): void {
        instance.get('/restaurants')
            .then(function (response) {
                let status = response.data.statusCode;

                if (status === 200) {
                    const restaurants = response.data.constants.map((con: any) => ({
                        id: con.restaurant_id,
                        name: con.restaurant_name,
                    }));
                    setRestaurantList(restaurants);
                }
            })
            .catch(function (error) {
        
                console.error(error);
            });

    }


    function retrieveRestaurantsDates(): void {
        instance.get('/restaurants')
            .then(function (response) {
                let status = response.data.statusCode;

                if (status === 200) {
                    const restaurants = response.data.constants.map((con: any) => ({
                        id: con.restaurant_id,
                        open_time: con.open_time,
                        close_time: con.close_time
                    }));
                    setRestaurantDateList(restaurants);
                    andRefreshDisplay();
                }
            })
            .catch(function (error) {
                console.error(error);
            });

    }



    function retrieveReservations(): void {
   
        instance.get('/reservations')
            .then(function (response) {
                let status = response.data.statusCode;

                if (status === 200) {
                    const reservations = response.data.constants.map((con: any) => ({
                        table_id: con.table_id,
                        date: con.restaurant_date,
                        numPeople: con.numPeople
                    }));
                    setReservationList(reservations);
                    andRefreshDisplay();
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    
    function getDatesBetween(startDate: string, endDate: string): string[] {
        const start = new Date(startDate);
        const end = new Date(endDate);
     
        const dates: string[] = [];
    
        while (start <= end) {
            // Add the current date to the list in 'YYYY-MM-DD' format
            dates.push(start.toISOString().split('T')[0]);
    

           
            // Increment the date by one day
            start.setDate(start.getDate() + 1);
        }
     

        return dates;
    }

    function retrieveTableList(restaurantID: Number): void {
        instance.post('/restaurant_tables/get_tables', { restaurant_id: restaurantID })
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


   function determineUtilization(){
    andRefreshDisplay
  
    let open_time
    let close_time
   
    let reservedSeats=0
    let reservedTables=0
    let sumAvailability             
    let sumUtilization
    let tableCount=0
    let seatCount=0
    let List: Avail[] = [];
  
  // dealing with ending and starting times for teh day
    const date=restaurantDateList.find(restaurant => restaurant.id==restaurantIDforReport)
    let tables=tableList;

   

    const sumtableSeats: number = tableList.reduce((accumulator, table) => accumulator + table.seats, 0);  
    let reservation=reservationList 
    let filteredReservation: any[] = []

   
for (let t = 0; t < tables.length; t++) {
   
    let filteredForTable = reservation.filter(res => res.table_id == tables[t].table_id);
 
    filteredReservation = filteredReservation.concat(filteredForTable);
}






    if(date?.open_time!=null){
     open_time=date.open_time}
    else{
        open_time=0;
    }



    if(date?.close_time!=null){
        close_time=date.close_time}
       else{
           close_time=24;
       }



// getting dates to look through 
   let Dates_List = getDatesBetween(start_date,end_date)


    for (let i = 0; i < Dates_List.length; i++) {


   for (let h=open_time; h< close_time; h++){



    //adding tables 
 
    tableCount=tableCount+tables.length;

    seatCount=seatCount+sumtableSeats;

    

    const ReservationsbyDate = filteredReservation.filter(reservation => {
        const Date = String(reservation.date.slice(0, 10));
        const hour = String(reservation.date.slice(11,13));
        return hour == String(h) && Date==Dates_List[i];
    })
    
    
  

    for (let t=0;  t< tableList.length; t++){

    for(let r=0; r<ReservationsbyDate.length; r++ ){
      if(tableList[t].table_id==ReservationsbyDate[r].table_id){
        reservedSeats=(ReservationsbyDate[r].numPeople)+reservedSeats
        reservedTables=reservedTables+1

      }}}


   }
    

    sumAvailability=((tableCount-reservedTables)/tableCount)*100
    

    sumUtilization=(reservedSeats/seatCount)*100
  
    List.push({
        date: Dates_List[i],
        availability: sumAvailability,
        utilization: sumUtilization
      });

   
  sumAvailability=0;
  sumUtilization=0;
  seatCount=0;
  tableCount=0;
  reservedTables=0;
  reservedSeats=0;
  
    

    }

    
setReportList(List)

   
   
}



    function deleteRestaurant(): void {
        instance.post('/restaurants/deleted_restaurants', { restaurant_id: restaurantID })
            .then(function (response) {
                let status = response.data.statusCode;
                if (status == 200) {
                    console.log("Deleted restaurant: " + restaurantID)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }


    function deleteReservation(): void {
        instance.post('/reservations/cancel_reservation', { confirmationNum: confirmationNum, email: email })
            .then(function (response) {
                let status = response.data.statusCode;
                if (status == 200) {
                    console.log("Deleted reservation")
                }
                andRefreshDisplay()
            })
            .catch(function (error) {
                console.log(error)
            })

     setConfirmationNum("")
     setEmail("")
    }

    return (

        
        <div>
             {/* Sign Out Button */}
             <button className="button" onClick={handleSignout}>Sign Out</button>
            {/* List Restaurants Section */}
            <div className="restaurantListContainer">
                <button className="button" onClick={retrieveRestaurants}>{"List Restaurants"}</button>
                <label className="restaurantList">
                    {restaurantList.map((restaurant) => (
                        <div key={restaurant.id}>
                            {restaurant.id}: {restaurant.name}
                        </div>
                    ))}
                </label>
            </div>
    
            {/* Delete Restaurant Section */}
            <div className="deleteRestaurantContainer">
                <label> Delete Restaurant - </label>
                ID: <input 
                    type="text" 
                    className="text" 
                    value={restaurantID} 
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || !isNaN(Number(value))) {
                            setRestaurantID(value);
                        
                        }
                    }} 
                />
                <button className="button" onClick={deleteRestaurant}>{"Delete Restaurant"}</button>
            </div>
    
   
    
            {/* Delete Reservation Section */}
            <div className="deleteReservationContainer">
                <label> Delete Reservation </label>
                Confirmation Code: <input 
                    type="text" 
                    className="text" 
                    value={confirmationNum} 
                    onChange={(e) => {
                        const value = e.target.value;
                        setConfirmationNum(value);
                    }} 
                />
    
                <label>  </label>
                Email: <input 
                    type="text" 
                    className="text" 
                    value={email} 
                    onChange={(e) => {
                        const value = e.target.value;
                        setEmail(value);
                    }} 
                />

                     <button className="button" onClick={deleteReservation}>Delete Reservation</button>

         {/* Availability Report Section */}
         <div className="availabilityReportContainer">
                <label>  Generate Availability Report </label>
                ID: <input 
                    type="text" 
                    className="text" 
                    value={restaurantIDforReport} 
                    onChange={(e) => {
                        const value = e.target.value;
                        setRestaurantIDforReport(value);
                        retrieveReservations()
                    
                    }} 
                />
    
                <label>  </label>
                End Date: <input 
                    type="text" 
                    className="text" 
                    value={end_date} 
                    onChange={(e) => {
                        const value = e.target.value;
                        setendDate(value);
                        retrieveTableList(Number(restaurantIDforReport))
                    }} 
                />
    
                <label>  </label>
                Start Date: <input 
                    type="text" 
                    className="text" 
                    value={start_date} 
                    onChange={(e) => {
                        const value = e.target.value;
                        setStartDate(value);
                        retrieveTableList(Number(restaurantIDforReport))
                    }} 
                />
    
                <button className="button" onClick={determineUtilization}>Utilization</button>
    
                {/* Report List */}
                <div>
                    <label className="reportList">
                        {reportList.map((reportList) => (
                            <div key={reportList.date}>
                         Date: {reportList.date}     Utilization: {reportList.utilization}     Availability: {reportList.availability}
                            </div>
                        ))}
                    </label>
                </div>
            </div>



            </div>
    
         
        </div>
    );
    
}