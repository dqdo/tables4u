import mysql from 'mysql'

export const handler = async (event) => {
      
    const CreateRestaurant = (name, location, status = 'inactive') => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO restaurants (restaurant_name, restaurant_location, status) 
                VALUES (?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                    restaurant_name = VALUES(restaurant_name), 
                    restaurant_location = VALUES(restaurant_location), 
                    status = VALUES(status);`;
            const params = [name, location, status];
    
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
        await CreateRestaurant(event.name, event.location, event.status)
    
        response = {
            statusCode: 200,
            result: {
                name: event.name,
                location: event.location,
                status: event.status
            }
        };
      } catch (error){
        response = {
            statusCode: 400,
            error: "Failed to create or update restaurant.",
            details: error.message
          };
      }
      
      pool.end()  
    
      return response;
    }
    