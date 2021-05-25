const mariadb = require("mariadb");

//Database password from the .ENV file, it's a good practice to do so
const DBPASS = process.env.DBPASSWORD;

//Set Database connection, this pool connection will be used to query the database
const pool = mariadb.createPool({host: '127.0.0.1',port:'3306', user: 'root', database:'techchallengedb', password: DBPASS, connectionLimit: 5});

//Simple function that is going to be used to filter properties by number of bedrooms
const countBedrooms = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

//Add a new Property in one POST request:
exports.createProperty = function(req,res){
    //First check to see if request body is empty
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).json({message:"Request body missing"})
    }
    //check if request body has the right amount of parameters
    if(Object.keys(req.body).length != 2){
        return res.status(400).json({message:"Wrong request body"})
    }
    //Check if both parameters naming are the right ones
    if(!req.body.name || !req.body.units){
        return res.status(400).json({message:"At least one wrong request parameter"})
    }
    //Check if property has at least one unit
    if(req.body.units.length == 0){
        return res.status(400).json({message:"Your new property should at least have one unit"})
    }

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
        }).catch(err => { //Catch block to detect error with the DB query
            conn.end();
            return res.status(500).json({
            message: "Sorry, found an issue with the query. Keep in mind that ' char won't be accepted",
            })
        })
        //In this case instead of a for cycle, I'll use the map function that returns promisses. A for loop wouldn't work because the code after it would execute first
        Promise.all(propertyUnits.map(Unit => {
            return new Promise(resolve => { //I simply map every Unit name from the request array and resolve the new unitvalidator value into an array
                conn.query("SELECT Count(*) AS matches FROM roomlookuptable WHERE roomlookuptable.RoomName Like '"+Unit+"'")
                .then((rows) => {
                    UnitValidator = UnitValidator + parseInt(rows[0].matches) //If the name matches one of the lookup table, add +1 to the validator
                    resolve(UnitValidator) //Add the updated value to the resolve array
                }).catch(err => { //Catch block to detect error with the DB query
                    conn.end();
                    return res.status(500).json({
                    message: "Sorry, found an issue with the query. Keep in mind that ' char won't be accepted",
                    })
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
                }).catch(err => { //Catch block to detect error with the DB query
                    conn.end();
                    return res.status(500).json({
                    message: "Sorry, found an issue with the query. Keep in mind that ' char won't be accepted",
                    })
                  })
            }).catch(err => { //Catch block to detect problems with the mapping function
                conn.end();
                return res.status(500).json({
                message: "Sorry, we had an internal server error!",
                })
            })
      }).catch(err =>{  //Catch block to detect and catch DB connection issues
            conn.end();
            return res.status(500).json({
            message: "Couldn't connect to the Database!",
        })})
}



//Delete a property functionality
exports.deleteProperty = function(req,res){

    //First check to see if request body is empty
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).json({message:"Request body missing"})
    }
    //check if request body has too many parameters
    if(Object.keys(req.body).length > 1){
        return res.status(400).json({message:"Wrong request body"})
    }
    //Check if parameter naming is the right one (name)
    if(!req.body.name){
        return res.status(400).json({message:"Wrong request parameter"})
    }

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
                    }).catch(err => { //Catch block to detect error with the DB query
                        conn.end();
                        return res.status(500).json({
                        message: "Sorry, found an issue with the query. Keep in mind that ' char won't be accepted",
                        })
                    })
                }).catch(err => { //Catch block to detect error with the DB query
                    conn.end();
                    return res.status(500).json({
                    message: "Sorry, found an issue with the query. Keep in mind that ' char won't be accepted",
                    })
                })
            }).catch(err => { //Catch block to detect error with the DB query
                conn.end();
                return res.status(500).json({
                message: "Sorry, found an issue with the query. Keep in mind that ' char won't be accepted",
                })
            })
        }).catch(err =>{  //Catch block to detect and catch DB connection issues
            conn.end();
            return res.status(500).json({
            message: "Couldn't connect to the Database!",
        })})
}


//Get all properties
exports.getProperties = function(req,res){
    properties = [] //this varible will be used to hold all the properties custom objects
    filteredProperties = [] //this varible will be used to hold all the filtered properties

    pool.getConnection()
    .then(conn => { //First get all names and ids of every property from the DB
        conn.query("SELECT idProperties, properties.Name AS Name FROM properties ORDER BY properties.Name")
        .then((rows) => {
            //Once again instead of a for cycle, I'll use the map function that returns promisses. A for loop wouldn't work because the code after it would execute first
            Promise.all(rows.map(property => {
                return new Promise(resolve => { //I simply cycle every previously fetched property ID and get that property Units
                    conn.query("SELECT propertyrooms.RoomName, properties.Name AS Name FROM properties,propertyrooms WHERE propertyrooms.Properties_idProperties = '"+property.idProperties+"' && properties.idProperties = '"+property.idProperties+"'")
                    .then((rows) => {
                        Promise.all(rows.map(Unit => {
                            return new Promise(resolve => { //I simply map every Unit name from the request array and resolve the new unitvalidator value into an array
                                propertyUnits = Unit.RoomName //get all property names and resolve it into a new array with the resolve function
                                resolve(propertyUnits)
                            })})).then(propertyUnits=>{ //After all promisses are resolved, continue code execution 
                                resolve(this.properties.push({  //Push the new property objects to the properties array
                                    name: rows[0].Name, //Name of the property is set using the first row of the query results, and getting the Name column value
                                    units: propertyUnits
                                }))
                            })
                    }).catch(err => { //Catch block to detect error with the DB query
                        conn.end();
                        return res.status(500).json({
                        message: "Sorry, found an issue with the query. Keep in mind that ' char won't be accepted",
                        })
                    })
            })})).then(()=>{ //After all promisses are resolved (both maps) continue code execution
                //if no request querie is passed, meaning the user doesn't want to filter by bedroom number, then send all properties as it is
                if(!req.query.filters){
                    conn.end();
                    return res.status(200).json({properties:this.properties}) //Here the response is already sorted in the DB SQL Query, no need to srot the response body array
                }   
                    if(!Array.isArray(req.query.filters)){ //Check if the request query parameters were passed as an array otherwise send bad request error message
                        conn.end();
                        return res.status(400).json({message:"Filters should be in array format, use ?filters[]=x"})
                    }

                    //if the get requests has request queries parameters, then cycle through all filters and get properties with x bedrooms (accepts more than one filter)
                    Promise.all(req.query.filters.map(filter => {   //once again map was used, in order to use the promise functionality, for each and for loops won't work
                        return new Promise(resolve => {
                            if(isNaN(parseInt(filter))){    //Check if any of the filter is a non numeric value and if it is return bad request error message
                                conn.end();
                                return res.status(400).json({message:"Your filter is not a number. You can only filter by number of bedrooms"})
                            }
                            Promise.all(this.properties.map(property => { 
                                return new Promise(resolve => { //For each filter value, map the properties array and push the properties with filtered number of bedrooms
                                    if(countBedrooms(property.units,"bedroom") == parseInt(filter)){
                                        this.filteredProperties.push(property)  //get all the properties that match the filtered number of bedrooms
                                    } 
                                    resolve(filteredProperties) //resolve promises
                                })})).then(()=>{ //After all promisses are resolved, continue code execution 
                                    resolve(filteredProperties) //resolve promises
                            }).catch(err => { //Catch block to detect problems with the mapping function
                                conn.end();
                                return res.status(500).json({
                                message: "Sorry, we had an internal server error!",
                                })
                            })
                        })})).then(()=>{ //After all promisses are resolved, continue code execution 
                            conn.end();
                            return res.status(200).json({properties:this.filteredProperties.sort((a,b)=> (a.name > b.name ? 1 : -1))})  //Send the filtered properties, sorted by name
                        }).catch(err => { //Catch Block to detect errors witht the mapping function
                            conn.end();
                            return res.status(500).json({
                            message: "Sorry, we had an internal server error!",
                            })
                        })
                })
        }).catch(err => { //Catch block to detect errors querying the DB
            conn.end();
            return res.status(500).json({
            message: "Sorry, found an issue with the query. Keep in mind that ' char won't be accepted",
            })
        })
    }).catch(err =>{  //Catch block to detect and catch DB connection issues
        conn.end();
        return res.status(500).json({
        message: "Couldn't connect to the Database!",
    })})
}