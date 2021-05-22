const controller = require("../controller/controller")

const routes = (app)=>{
    //Routes will be defined here
    app.route('/properties')
      .post(controller.createProperty)
}

module.exports = routes;