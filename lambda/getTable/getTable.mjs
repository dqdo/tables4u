import mysql from 'mysql';

export const handler = async (event) => {

  let response; // Declare the response variable at the top for later assignment

  const ListTables = (restaurant_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `
          SELECT * FROM restaurant_tables 
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

    const all_tables = await ListTables(restaurant_id);

    response = {
      statusCode: 200,
      tables: all_tables,
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
