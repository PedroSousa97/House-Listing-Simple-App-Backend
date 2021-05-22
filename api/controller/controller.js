const mariadb = require("mariadb");

//Database password from the .ENV file, it's a good practice to do so
const DBPASS = process.env.DBPASSWORD;

//Set Database connection, this pool connection will be used to query the database
const pool = mariadb.createPool({host: '127.0.0.1',port:'3306', user: 'root', database:'techchallengedb', password: DBPASS, connectionLimit: 5});


//Add a new Property in one POST request:
exports.createProperty = function(req,res){
    propertyName = req.body.name; //property name request parameter
    propertyUnits = req.body.units //array of units request parameter
    UnitValidator = 0;  //Validator used to check if all unit names are one of the allowed values

    pool.getConnection()
      .then(conn => {
        //First of all, since property names are unique and their identifier, check to see if the received name already exists
        conn.query("SELECT Count(*) AS matches FROM properties WHERE properties.Name Like '"+propertyName+"'")
        .then((rows) => {
            if(rows[0].matches>0){  //If I find a match, meaning the name is already in use, return a Bad Request error message, otherwise continue
                conn.end();                         
                return res.status(400).json({message:"The chosen property name is already in use"})
            }
        }).catch(err => {
            console.log(err); //in case of error, log the error just for debugging purposes
            conn.end();
        })
        //In this case instead of a for cycle, I'll use the map function that returns promisses. A for loop wouldn't work because the code after it would execute first
        Promise.all(propertyUnits.map(Unit => {
            return new Promise(resolve => { //I simply map every Unit name from the request array and resolve the new unitvalidator value into an array
                conn.query("SELECT Count(*) AS matches FROM roomlookuptable WHERE roomlookuptable.RoomName Like '"+Unit+"'")
                .then((rows) => {
                    UnitValidator = UnitValidator + parseInt(rows[0].matches) //If the name matches one of the lookup table, add +1 to the validator
                    resolve(UnitValidator) //Add the updated value to the resolve array
                }).catch(err => {
                    console.log(err); //in case of error, log the error just for debugging purposes
                    conn.end();
                })
            })})).then(UnitValidator=>{ //After all promisses are resolved, continue code execution 
                //If all names were allowed, then the last value of the array should be equal to the propertyunits array length
                if(UnitValidator[UnitValidator.length-1] != propertyUnits.length){ 
                    conn.end();                             //Otherwise we have an invalid value, so we don't create the new property and return a bad request error message
                    return res.status(400).json({message:"At least one of the specified Unit names is not allowed"})
                }
                conn.query("INSERT INTO properties (Name) VALUES ('"+propertyName+"')") //If all values are fine start the insert, first the property name
                .then((rows) => {
                    propertyid = rows.insertId;
                    for(var i = 0; i<propertyUnits.length; i++){    //Tehn for each Unit name, added to the unit table, using the newly added property id
                        conn.query("INSERT INTO propertyrooms (Properties_idProperties,RoomName) VALUES ('"+rows.insertId+"','"+propertyUnits[i]+"')")
                        .then((rows) => {
                            UnitValidator = UnitValidator + parseInt(rows[0].match)
                        })
                    }
                    conn.end();
                    return res.status(201).json({message:"Property created successfully"}) //At this point, property should be created, Created status message is sent
                }).catch(err => {
                    console.log(err); //in case of error, log the error just for debugging purposes
                    conn.end();
                  })
            })
        
      }).catch(err =>{  //Catch block to detect and catch DB connection issues
        conn.end();
          return res.status(500).json({
            message: "Couldn't connect to the Database!",
          })})
}



//delete a property functionality
exports.deleteProperty = function(req,res){
    propertyName = req.body.name; //property name request parameter
    id = 0;

    pool.getConnection()
        .then(conn => {
            //First of all, let's check if the received property name exist
            conn.query("SELECT idProperties AS id FROM properties WHERE properties.Name Like '"+propertyName+"'")
            .then((rows) => {
                if(!rows[0]){  //if now results were return, that means that the received property name doesn't exist
                    conn.end(); //In this case send a bad request error message                     
                    return res.status(400).json({message:"The chosen property name doesn't exist"})
                }
                id= parseInt(rows[0].id) //Save the id for further queries, and try the deletes, first the child table then the parent one
                conn.query("DELETE FROM propertyrooms WHERE propertyrooms.Properties_idProperties = '"+id+"'")
                .then((rows) => {
                    conn.query("DELETE FROM properties WHERE idProperties = '"+id+"'")
                    .then((rows) => {
                        conn.end();
                        return res.status(202).json({message:"Property deleted successfully"}) //At this point, property should be deleted, Accepted status message is sent
                    }).catch(err => {
                        console.log(err); //in case of error, log the error just for debugging purposes
                        conn.end();
                    })
                }).catch(err => {
                    console.log(err); //in case of error, log the error just for debugging purposes
                    conn.end();
                })
            }).catch(err => {
                console.log(err); //in case of error, log the error just for debugging purposes
                conn.end();
            })
        }).catch(err =>{  //Catch block to detect and catch DB connection issues
        conn.end();
          return res.status(500).json({
            message: "Couldn't connect to the Database!",
        })})
}