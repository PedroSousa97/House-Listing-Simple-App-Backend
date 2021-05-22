const mariadb = require("mariadb");

//Database password from the .ENV file, it's a good practice to do so
const DBPASS = process.env.DBPASSWORD;

//Set Database connection, this pool connection will be used to query the database
const pool = mariadb.createPool({host: '127.0.0.1',port:'3306', user: 'root', database:'techchallengedb', password: DBPASS, connectionLimit: 5});

exports.testDBConnection = function(req,res){
    // I already Inserted Unit allowed names on the Unit name lookup table, lets use it to test the DB connection

    pool.getConnection()
      .then(conn => {
        conn.query("SELECT * FROM roomlookuptable")
      .then((rows) => {
        conn.end();
        return res.status(200).send(rows);})
      }).catch(err =>{
        conn.end();
          return res.status(500).json({
            code: "0",
            message: "Couldn't connect to the Database!",
          })})
}