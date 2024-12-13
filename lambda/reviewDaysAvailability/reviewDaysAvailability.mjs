import mysql from 'mysql';

export const handler = async (event) => {

  const getReservations = (restaurant_date, restaurant_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `
          SELECT r.table_id, HOUR(r.restaurant_date) AS hour, SUM(r.numPeople) AS reservedSeats
          FROM reservations r
          JOIN restaurant_tables t ON r.table_id = t.table_id
          WHERE DATE(r.restaurant_date) = DATE(?) AND t.restaurant_id = ?
          GROUP BY r.table_id, HOUR(r.restaurant_date)
        `,
        [restaurant_date, restaurant_id],
        (error, rows) => {
          if (error) {
            return reject(error);
          }
          return resolve(rows);
        }
      );
    });
  };

  const getTables = (restaurant_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `
          SELECT table_id, seats
          FROM restaurant_tables
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

  let response;
  try {
    const { restaurant_date, restaurant_id } = event;

    const [reservations, tables] = await Promise.all([
      getReservations(restaurant_date, restaurant_id),
      getTables(restaurant_id),
    ]);

    const totalTables = tables.length;
    const totalCapacity = tables.reduce((sum, table) => sum + table.seats, 0);

    const reservationHours = {};

    reservations.forEach((reservation) => {
      const { hour, reservedSeats } = reservation;
      if (!reservationHours[hour]) {
        reservationHours[hour] = { reservedSeats: 0, occupiedTables: 0 };
      }
      reservationHours[hour].reservedSeats += reservedSeats;
      reservationHours[hour].occupiedTables += 1;
    });

    let totalReservedSeats = 0;
    let totalUtilization = 0;
    let totalAvailability = 0;

    const calculatedReservationHours = {};
    const hours = Object.keys(reservationHours);

    hours.forEach((hour) => {
      const { reservedSeats, occupiedTables } = reservationHours[hour];

      const utilization = ((reservedSeats / totalCapacity) * 100).toFixed(2);
      const availableTables = totalTables - occupiedTables;
      const availability = ((availableTables / totalTables) * 100).toFixed(2);

      totalReservedSeats += reservedSeats;
      totalUtilization += parseFloat(utilization);
      totalAvailability += parseFloat(availability);

      calculatedReservationHours[hour] = {
        reservedSeats,
        utilization: `${utilization}%`,
        availability: `${availability}%`,
      };
    });

 
    const overallUtilization = ((totalReservedSeats / (totalCapacity * hours.length)) * 100).toFixed(2);
    const averageAvailability = (totalAvailability / hours.length).toFixed(2);

    response = {
      statusCode: 200,
      result: {
        restaurant_date,
        totalCapacity,
        totalTables,
        report: calculatedReservationHours,
        summary: {
          overallUtilization: `${overallUtilization}%`,
          averageAvailability: `${averageAvailability}%`,
        },
      },
    };
  } catch (error) {
    console.error(error);
    response = {
      statusCode: 400,
      error: "Failed to retrieve data.",
    };
  }

  pool.end();
  return response;
};
