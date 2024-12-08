import mysql from 'mysql';

export const handler = async (event) => {

  let response; 

  const ListClosedDays = (restaurant_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `
          SELECT * FROM closed_days 
          WHERE restaurant_id = ?
        `,
        [restaurant_id],
        (error, rows) => {
          if (error) {
            return reject(error);
          }
          return resolve(rows);
        }
      );
    });
  };

  try {
    const restaurant_id = event.restaurant_id; 
    if (!restaurant_id) {
      throw new Error("Missing restaurant_id");
    }

    const all_dates = await ListClosedDays(restaurant_id);

    response = {
      statusCode: 200,
      restaurant_date: all_dates,
    };
  } catch (error) {
    console.error("Error fetching tables:", error);
    response = {
      statusCode: 400,
      error: "Failed to fetch tables",
    };
  } 
    
  pool.end(); 
  
  // Return the response after closing the pool
  return response;
};
