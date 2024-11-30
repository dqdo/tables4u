import mysql from 'mysql'


export const handler = async (event) => {
 
  // get credentials from the db_access layer (loaded separately via AWS console)
 
  let ListAdministrator = () => {
      return new Promise((resolve, reject) => {
          pool.query("SELECT * FROM administrator", [], (error, rows) => {
              if (error) { return reject(error); }
              return resolve(rows);
          })
      })
  }


  const all_constants = await ListAdministrator()
 
  const response = {
    statusCode: 200,
    constants: all_constants
  }
 
  pool.end()     // close DB connections


  return response;
}