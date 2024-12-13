import mysql from 'mysql'

export const handler = async (event) => {
  const dateString = event.queryStringParameters?.date || JSON.parse(event.body)?.date;
  const date = new Date(dateString)
  
  if (!dateString) {
      return {
          statusCode: 400,
          body: JSON.stringify({ error: "Date parameter is required" }),
      };
  }

  const hour = date.getHours();
  const dateFormat = date.toISOString().split('T')[0];
  
  
  let ListAvailableRestaurants = (dateFormat, hour) => {
      return new Promise((resolve, reject) => {
          const query = `
            SELECT DISTINCT
            restaurants.restaurant_id, restaurants.restaurant_name
            FROM restaurants 

            INNER JOIN restaurant_tables 
            ON restaurants.restaurant_id = restaurant_tables.restaurant_id

            LEFT JOIN reservations
            ON restaurant_tables.table_id = reservations.table_id
            AND DATE (reservations.restaurant_date) = ?
            AND HOUR (reservations.restaurant_date) = ?

            LEFT JOIN closed_days
            ON restaurants.restaurant_id = closed_days.restaurant_id
            AND DATE (closed_days.restaurant_date) = ?

            WHERE reservations.table_id IS NULL
            AND closed_days.restaurant_date IS NULL
            AND restaurants.status = 'active';
            `;

            const params = [dateFormat, hour, dateFormat]
   
            pool.query(query, params, (error, results) => {
              if (error) {
                  return reject(error);
              }
              resolve(results);
          });
      });
  };

  const all_Available_Restaurants = await ListAvailableRestaurants(dateFormat, hour)
  
  const response = {
      statusCode: 200,
      body: JSON.stringify({ availableRestaurants: all_Available_Restaurants }),
  };
  
  pool.end()     // close DB connections

  return response;
}
