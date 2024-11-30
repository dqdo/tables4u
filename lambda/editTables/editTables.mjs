import mysql from 'mysql'

export const handler = async (event) => {
// get credentials from the db_access layer (loaded separately via AWS console)
// Make sure to delete this when copy and pasting to VScode or React Application BEFORE committing.

const editRestaurantTableSeatNumber = (table_id, seats, availability = 'available') => {
    return new Promise((resolve, reject) => {
      const checkQuery = `
        SELECT * FROM restaurant_tables 
        WHERE table_id = ?
      `;
      const checkParams = [table_id];

      pool.query(checkQuery, checkParams, (checkError, checkResults) =>{
        if (checkError) {
          return reject(checkError);
        }
        resolve (checkResults);

      })

      const updateQuery = `
        UPDATE restaurant_tables
        SET seats = ?
        WHERE table_id = ?
        `;
        
        const updateParams = [seats, table_id];

        pool.query(updateQuery,updateParams, (updateError, updateResults) => {
          if (updateError) {
            return reject (updateError);
          }
          
          resolve(updateResults)

        })
      }); 
    };

  let response
  try{
    await editRestaurantTableSeatNumber(event.table_id, event.seats, event.availability)

    response = {
        statusCode: 200,
        result: {
            seats : event.seatNumber,
            table_id : event.table_id,
            availability : event.availability
        }
    };
  } catch (error){
    response = {
        statusCode: 400,
        error: "Failed to update restaurant table seat numbers.",
        details: error.message
      };
  }
  
  pool.end()  

  return response;

}



