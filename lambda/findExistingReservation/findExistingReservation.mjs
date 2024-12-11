import mysql from 'mysql';

export const handler = async (event) => {

  const getReservationDetails = (confirmationNum, email) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT table_number, confirmation_number, table_id, email, restaurant_date, numPeople 
        FROM reservations 
        WHERE confirmation_number = ? AND email = ?;
      `;
      const params = [confirmationNum, email];

      pool.query(query, params, (error, results) => {
        if (error) {
          return reject(error);
        }
        if (results.length === 0) {
          return reject(new Error("Could not find reservation."));
        }
        resolve(results[0]);
      });
    });
  };

  let response;
  try {
    const reservation = await getReservationDetails(event.confirmationNum, event.email);

    response = {
      statusCode: 200,
      reservationDetails: reservation
    };
  } catch (error) {
    response = {
      statusCode: 400,
      error: "Failed to retrieve reservation details.",
      details: error.message
    };
  }

  pool.end();

  return response;
};
