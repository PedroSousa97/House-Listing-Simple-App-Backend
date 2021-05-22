var controller = require("../controller/controller")

const routes = (app)=>{
    //Routes will be defined here
    app.route('/backendtest')
      .get(controller.backendtestendpoint)
}

module.exports = routes;