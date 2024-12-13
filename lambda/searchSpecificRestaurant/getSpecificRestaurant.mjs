import { stat } from 'fs';
import mysql from 'mysql'

export const handler = async (event) => {


const selectSpecificRestaurant = (restaurantId) => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT * 
        FROM restaurants
        WHERE restaurant_id = ?
      `;
        const params = [restaurantId];

        pool.query(query, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
};


  let response
  try{
    const findRestaurant = await selectSpecificRestaurant(event.restaurantId)

    response = {
        statusCode: 200,
        result: {
            restaurantId: event.restaurant_id,
            restaurants : findRestaurant,
        }
    };
  } catch (error){
    response = {
        statusCode: 400,
        error: "Failed to find restaurant.",
        details: error.message
      };
  }
  
  pool.end()     // close DB connections

  return response;
}


