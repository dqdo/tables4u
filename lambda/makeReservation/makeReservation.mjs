import mysql from 'mysql'

export const handler = async (event) => {
  
    const checkAvailability = (tableID, reservationDate) => {
      return new Promise((resolve, reject) => {
         const query = `
            SELECT COUNT(*) AS conflictCount
            FROM reservations
            WHERE table_id = ? AND restaurant_date = ?;`;
            const params = [tableID, reservationDate];
  
            pool.query(query, params, (error, results) => {
              if (error) {
                 return reject(error);
               }
              const conflictCount = results[0].conflictCount
              resolve(conflictCount === 0);
              });
          });
      };
      
    const MakeReservation = (tableNumber, tableID, email, reservationDate, people) => {
      return new Promise((resolve, reject) => {
          const confirmation_number = Math.floor(100000 + Math.random() * 900000);

          const query = `
              INSERT INTO reservations (table_number, confirmation_number, table_id, email, restaurant_date, numPeople) 
              VALUES (?, ?, ?, ?, ?, ?);`;

          const params = [tableNumber, confirmation_number, tableID, email, reservationDate, people];
          console.log(params);

          pool.query(query, params, (error, results) => {
              if (error) {
                  return reject(error);
              }
              resolve({ confirmation_number, results });
            });
          });
  };

  let response
  try{
    const available = await checkAvailability(event.tableID, event.reservationDate);
    if (!available) {
      return {
        statusCode: 400,
        error: "Table is no longer available.",
      };
    }
    
    const { confirmation_number } = await MakeReservation(
      event.tableNumber,
      event.tableID,
      event.email,
      event.reservationDate,
      event.people
    );

    response = {
        statusCode: 200,
        result: {
            tableNumber: event.tableNumber,
            confirmation_number: confirmation_number,
            tableID: event.tableID,
            email: event.email,
            reservationDate: event.reservationDate,
            people: event.people
        }
    };
  } catch (error){
    response = {
        statusCode: 400,
        error: "Failed to create reservation.",
        details: error.message
      };
  }
  
  pool.end()  

  return response;
  }