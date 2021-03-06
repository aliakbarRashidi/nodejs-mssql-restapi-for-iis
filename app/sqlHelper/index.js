//Helper module for querying the DB
//BASE SETUP
//===========================

//CALL THE PACKAGES ------------
const config = require(__base + 'app/config').DBConfig;
const sql = require("mssql");

module.exports = {

  queryDB: (query, callback, error, operation, middleware) => {

    //to avoid Global connection if there is any
    sql.close();

    sql.connect(config, (err) => {

      if (err) {
        error(err);
        console.log(err);
        sql.close();
        return;
      }

      // create Request object
      let request = new sql.Request();

      // query to the database and get the records
      request.query(query, (err, response) => {

        if (err) {
          error(err);
          console.log(err);
          return;

        } else {

          //if the resource specifies a middleware, call it before returning json data
          if(middleware){
            middleware(response.recordset);
          }

          if (operation === 'read') {
            callback(operation, response.recordset);
            return;

          } else if (operation === 'update' || operation === 'post') {
            callback(operation, {rowsAffected: response.rowsAffected});
            return;
          }
        }
        sql.close();
      });
    })
  }
}
