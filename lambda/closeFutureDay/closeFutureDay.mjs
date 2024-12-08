import mysql from 'mysql';

export const handler = async (event) => {
    
    const closeDay = (restaurant_id, restaurant_date) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO closed_days (restaurant_id, restaurant_date) 
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE 
                    restaurant_date = VALUES(restaurant_date);`;

            const params = [restaurant_id, restaurant_date];

            pool.query(query, params, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    };

    let response;
    try {
       
        const result = await closeDay(event.restaurant_id, event.restaurant_date);

        response = {
            statusCode: 200,
            result: {
                restaurant_id: event.restaurant_id,
                restaurant_date: event.restaurant_date,
            }
        };
    } catch (error) {
        response = {
            statusCode: 400,
            error: "Failed to add closed day entry.",
            details: error.message
        };
    }

    // End the connection pool
    pool.end();

    return response;
};
