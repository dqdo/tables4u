import mysql from 'mysql'

export const handler = async (event) => {
// get credentials from the db_access layer (loaded separately via AWS console)
// Make sure to delete this when copy and pasting to VScode or React Application BEFORE committing.

const editRestaurantTableSeatNumber = (restaurant_id, seats, table_number, availability = 'available') => {
    return new Promise((resolve, reject) => {
      
      const insertQuery = `
        INSERT INTO restaurant_tables (restaurant_id, seats, table_number, availability)
        VALUES (?,?,?,?)`;

        const insertParams = [restaurant_id, seats, table_number, availability];

        pool.query(insertQuery, insertParams, (insertError, insertResults) => {
          if (insertError) {
            return reject (insertError)
          }

          resolve(insertResults);
        });
      });
    };

  let response
  try{
    await editRestaurantTableSeatNumber(event.restaurant_id, event.seats, event.table_number, event.availability)

    response = {
        statusCode: 200,
        result: {
            seats : event.seats,
            tableNumber : event.table_number,
            restaurantID : event.restaurant_id,
            tableNumber : event.table_id
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



