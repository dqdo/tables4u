import mysql from 'mysql'

export const handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
    host: "ozuma-database.cfmmgqa4yqlg.us-east-2.rds.amazonaws.com",
    user: "restaurantAdmin",
    password: "rxedF5!hgs",
    database: "tables4u"
})
  
  let ListRestaurants = () => {
      return new Promise((resolve, reject) => {
          pool.query("SELECT * FROM restaurants", [], (error, rows) => {
              if (error) { return reject(error); }
              return resolve(rows);
          })
      })
  }

  const all_constants = await ListRestaurants()
  
  const response = {
    statusCode: 200,
    constants: all_constants
  }
  
  pool.end()     // close DB connections

  return response;
}