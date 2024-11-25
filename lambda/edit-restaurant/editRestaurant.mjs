import mysql from 'mysql'

export const handler = async (event) => {
// get credentials from the db_access layer (loaded separately via AWS console)
// Make sure to delete this when copy and pasting to VScode or React Application BEFORE committing.
  
const editRestaurantName = (restaurant_id, newName) => {
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
        SET restaurant_name = ?
        WHERE restaurant_id = ?
        `;
        
        const updateParams = [newName, restaurant_id];

        pool.query(updateQuery,updateParams, (updateError, updateResults) => {
          if (updateError) {
            return reject (updateError);
          }
          
          resolve(updateResults)

        });
      });
    };

    const editRestaurantLocation = (restaurant_id, newLocation) => {
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
          SET restaurant_location = ?
          WHERE restaurant_id = ?
          `;
          
          const updateParams = [newLocation, restaurant_id];
  
          pool.query(updateQuery,updateParams, (updateError, updateResults) => {
            if (updateError) {
              return reject (updateError);
            }
            
            resolve(updateResults)
  
          });
        });
      };

    const editOpenLocation = (restaurant_id, newOpenTime) => {
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
            SET open_time = ?
            WHERE restaurant_id = ?
            `;
            
            const updateParams = [newOpenTime, restaurant_id];
    
            pool.query(updateQuery,updateParams, (updateError, updateResults) => {
              if (updateError) {
                return reject (updateError);
              }
              
              resolve(updateResults)
    
            });
          });
        };

        const editCloseLocation = (restaurant_id, newCloseTime) => {
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
              SET close_time = ?
              WHERE restaurant_id = ?
              `;
              
              const updateParams = [newCloseTime, restaurant_id];
      
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
    await editRestaurantName(event.restaurant_id, event.newName)
    await editRestaurantLocation(event.restaurant_id, event.newLocation)
    await editOpenLocation(event.restaurant_id, event.newOpenTime)
    await editCloseLocation(event.restaurant_id, event.newCloseTime)

    response = {
        statusCode: 200,
        result: {
            newName: event.newName,
            newLocation : event.newLocation,
            newOpenTime : event.newOpenTime,
            newCloseTime : event.newCloseTime,
            restaurantID: event.restaurant_id
        }
    };
  } catch (error){
    response = {
        statusCode: 400,
        error: "Failed to update restaurant.",
        details: error.message
      };
  }
  
  pool.end()  

  return response;
}


