import mysql from 'mysql';

export const handler = async (event) => {
  // Database connection pool setup

  const editRestaurantName = (restaurant_id, newName) => {
    return new Promise((resolve, reject) => {
      const updateQuery = `
        UPDATE restaurants
        SET restaurant_name = ?
        WHERE restaurant_id = ?
      `;
      const updateParams = [newName, restaurant_id];

      pool.query(updateQuery, updateParams, (updateError, updateResults) => {
        if (updateError) {
          return reject(updateError);
        }
        resolve(updateResults);
      });
    });
  };

  const editRestaurantLocation = (restaurant_id, newLocation) => {
    return new Promise((resolve, reject) => {
      const updateQuery = `
        UPDATE restaurants
        SET restaurant_location = ?
        WHERE restaurant_id = ?
      `;
      const updateParams = [newLocation, restaurant_id];

      pool.query(updateQuery, updateParams, (updateError, updateResults) => {
        if (updateError) {
          return reject(updateError);
        }
        resolve(updateResults);
      });
    });
  };

  const editOpenLocation = (restaurant_id, newOpenTime) => {
    return new Promise((resolve, reject) => {
      const updateQuery = `
        UPDATE restaurants
        SET open_time = ?
        WHERE restaurant_id = ?
      `;
      const updateParams = [newOpenTime, restaurant_id];

      pool.query(updateQuery, updateParams, (updateError, updateResults) => {
        if (updateError) {
          return reject(updateError);
        }
        resolve(updateResults);
      });
    });
  };

  const editCloseLocation = (restaurant_id, newCloseTime) => {
    return new Promise((resolve, reject) => {
      const updateQuery = `
        UPDATE restaurants
        SET close_time = ?
        WHERE restaurant_id = ?
      `;
      const updateParams = [newCloseTime, restaurant_id];

      pool.query(updateQuery, updateParams, (updateError, updateResults) => {
        if (updateError) {
          return reject(updateError);
        }
        resolve(updateResults);
      });
    });
  };

  
  let response;
  try {
    await editRestaurantName(event.restaurant_id, event.newName);
    await editRestaurantLocation(event.restaurant_id, event.newLocation);
    await editOpenLocation(event.restaurant_id, event.newOpenTime);
    await editCloseLocation(event.restaurant_id, event.newCloseTime);

    response = {
      statusCode: 200,
      result: {
        newName: event.newName,
        newLocation: event.newLocation,
        newOpenTime: event.newOpenTime,
        newCloseTime: event.newCloseTime,
        restaurantID: event.restaurant_id
      }
    };
  } catch (error) {
    response = {
      statusCode: 400,
      error: "Failed to update restaurant.",
      details: error.message
    };
  }

  // Close the database connection pool after all queries are finished
  pool.end();

  return response;
};
