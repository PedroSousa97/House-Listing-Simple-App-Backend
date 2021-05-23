const app = require("./api/app");
const http = require("http");

//Simple Server/API inicialization

//Function to deternmine if the port is a named pipe or a port number
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};


//Listening on port 3000 on localhost
const port = normalizePort(process.env.PORT || "3030");
app.set("port", port);

const server = http.createServer(app);

server.listen(port,() => {
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    console.log("Listening on " + bind);
});