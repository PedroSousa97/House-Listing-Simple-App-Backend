const controller = require("../controller/controller")

const routes = (app)=>{
    //Routes will be defined here
    app.route('/properties')
      .post(controller.createProperty) //Create Property logic is on the controller
      .delete(controller.deleteProperty) //Delete Property logic is on the controller
}

module.exports = routes;