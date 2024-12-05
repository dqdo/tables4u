import mysql from 'mysql'

export const handler = async (event) => {

    const cancelReservation = (confirmationNum, email) => {
      return new Promise((resolve, reject) => {
        const query = `
        DELETE FROM reservations 
        WHERE confirmation_number = ? AND email = ?;`;

        const params = [confirmationNum, email];

        pool.query(query, params, (error, results) => {
          if (error) {
            return reject(error);
          }
          if (results.affectedRows === 0) {
            return reject(new Error("Could not find reservation."));
          }
          resolve(results);
        });
        
      });
    };

    let response;
    try {
  
      await cancelReservation(event.confirmationNum, event.email);
  
      response = {
        statusCode: 200,
        message: "Reservation successfully canceled."
      };
    } catch (error) {
      response = {
        statusCode: 400,
        error: "Failed to cancel reservation.",
        details: error.message
      };
    }
  
    pool.end();
  
    return response;
  }