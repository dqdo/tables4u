import mysql from 'mysql'

export const handler = async (event) => {
// get credentials from the db_access layer (loaded separately via AWS console)
// Make sure to delete this when copy and pasting to VScode or React Application BEFORE committing.
    
const activateRestaurant = (restaurant_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM restaurants 
            WHERE restaurant_id = ?
            `;
        const params = [restaurant_id];

        pool.query(query, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        })
      
        const updateQuery = `
        
        UPDATE restaurants
        SET status = 'active'
        WHERE restaurant_id = ?
        `;
        
        const updateParams = [restaurant_id];

        pool.query(updateQuery,updateParams, (updateError, updateResults) => {
          if (updateError) {
            return reject (updateError);
          }
          
          resolve(updateResults)

        });
      });
    };

  let response
  try{
    await activateRestaurant(event.restaurant_id, event.status)

    response = {
        statusCode: 200,
        result: {
            status: event.status,
            restaurantID: event.restaurant_id
        }
    };
  } catch (error){
    response = {
        statusCode: 400,
        error: "Failed to activate restaurant.",
        details: error.message
      };
  }
  
  pool.end()  

  return response;
}


