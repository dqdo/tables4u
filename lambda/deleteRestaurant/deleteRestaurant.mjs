import mysql from 'mysql'

export const handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  
  const deleteRestaurant = (restaurant_id) => {
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
        
        DELETE FROM restaurants
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
    await deleteRestaurant(event.restaurant_id)
    response = {
        statusCode: 200,
        result: {
            restaurantID: event.restaurant_id
        }
    };
  } catch (error){
    response = {
        statusCode: 400,
        error: "Failed to delete restaurant.",
        details: error.message
      };
  }

  pool.end()     // close DB connections

  return response;
}

