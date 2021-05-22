const controller = require("../controller/controller")

const routes = (app)=>{
    //Routes will be defined here
    app.route('/dbtest')
      .get(controller.testDBConnection)
}

module.exports = routes;