import mysql from 'mysql';

export const handler = async (event) => {

  const checkDays = (restaurantID, reservationDate) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT COUNT(*) AS closedCount
        FROM closed_days
        WHERE restaurant_id = ? AND restaurant_date = DATE(?);`;
      const params = [restaurantID, reservationDate];

      pool.query(query, params, (error, results) => {
        if (error) return reject(error);
        resolve(results[0].closedCount > 0);
      });
    });
  };

  const getRestaurantHours = (restaurantID) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT open_time, close_time
        FROM restaurants
        WHERE restaurant_id = ?;`;
      const params = [restaurantID];

      pool.query(query, params, (error, results) => {
        if (error) return reject(error);
        if (results.length === 0) return reject(new Error("Restaurant not found."));
        resolve(results[0]);
      });
    });
  };

  const findAvailableTable = (restaurantID, reservationDate, reservationTime, numPeople) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT t.table_id, t.table_number, t.seats
        FROM restaurant_tables t
        LEFT JOIN reservations r
          ON t.table_id = r.table_id
          AND DATE(r.restaurant_date) = ?
          AND HOUR(r.restaurant_date) = ?
        WHERE t.restaurant_id = ?
          AND r.table_id IS NULL  
          AND t.seats >= ?        
        ORDER BY t.table_id ASC  
        LIMIT 1;`;
      const params = [reservationDate, reservationTime, restaurantID, numPeople];
  
      pool.query(query, params, (error, results) => {
        if (error) return reject(error);
        resolve(results.length > 0 ? results[0] : null);
      });
    });
  };
  
  

  const validateNoConflict = (tableID, reservationDate, reservationTime) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT COUNT(*) AS conflictCount
        FROM reservations
        WHERE table_id = ?
          AND DATE(restaurant_date) = ?
          AND HOUR(restaurant_date) = ?;`;
      const params = [tableID, reservationDate, reservationTime];

      pool.query(query, params, (error, results) => {
        if (error) return reject(error);
        resolve(results[0].conflictCount === 0);
      });
    });
  };

  const makeReservation = async (tableID, tableNumber, email, reservationDate, reservationTime, numPeople) => {
    const noConflict = await validateNoConflict(tableID, reservationDate, reservationTime);
    if (!noConflict) {
      throw new Error("Conflict detected. Table is already reserved.");
    }

    return new Promise((resolve, reject) => {
      const confirmationNumber = Math.floor(100000 + Math.random() * 900000);
      const query = `
        INSERT INTO reservations (table_id, table_number, confirmation_number, email, restaurant_date, numPeople)
        VALUES (?, ?, ?, ?, ?, ?);`;
      const params = [
        tableID,
        tableNumber,
        confirmationNumber,
        email,
        `${reservationDate} ${reservationTime}:00:00`,
        numPeople
      ];

      pool.query(query, params, (error, results) => {
        if (error) return reject(error);
        resolve({ confirmationNumber });
      });
    });
  };

  let response;
  try {
    const closed = await checkDays(event.restaurantID, event.reservationDate);
    if (closed) {
      return {
        statusCode: 400,
        error: "Cannot make a reservation. The restaurant is closed on this day."
      };
    }

    // Validate if the reservation time is within operating hours
    const { open_time, close_time } = await getRestaurantHours(event.restaurantID);
    if (event.reservationTime < open_time || event.reservationTime >= close_time) {
      return {
        statusCode: 400,
        error: `Reservations can only be made between ${open_time}:00 and ${close_time}:00.`
      };
    }

    const availableTable = await findAvailableTable(
      event.restaurantID,
      event.reservationDate,
      event.reservationTime,
      event.people
    );

    if (!availableTable) {
      return {
        statusCode: 400,
        error: "No available tables for the selected date and time."
      };
    }

    const { confirmationNumber } = await makeReservation(
      availableTable.table_id,
      availableTable.table_number,
      event.email,
      event.reservationDate,
      event.reservationTime,
      event.people
    );

    response = {
      statusCode: 200,
      result: {
        confirmationNumber,
        tableNumber: availableTable.table_number,
        reservationDate: event.reservationDate,
        reservationTime: event.reservationTime,
        people: event.people
      }
    };
  } catch (error) {
    response = {
      statusCode: 400,
      error: "Failed to create reservation.",
      details: error.message
    };
  } finally {
    pool.end();
  }

  return response;
};
