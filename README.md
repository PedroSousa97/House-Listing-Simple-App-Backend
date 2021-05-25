# Technical-Challenge-Backend

<p align="center">
    <h3 align="center">Project Overview</h3>
</p>

This project represents the back-end of the technical challenge app. Has required in the challenge description, front-end and back-end were separated in two different projects.

I like to separate my back-end into separate folders, according to the js files functionality that those folders contain. In my opinion, it is a good practice, and makes my code a lot easier to understand and the architecture of the back-end becomes a lot more intuitive, instead of nesting everything in a root folder or even worst nesting everything in a single file.

Having that into account, the back-end architecture is divided as follows:

<ul>
    <li>The only purpose of server.js is the API/Server initialization, that is the only thing that file does and for that reason it can be found at the root of the back-end project folder;
    </li>
    <li>api folder contains all the main api files:
        <ul>
            <li>app.js is where the express app is defined, which means that there you can find requests origin control and header settings and route registration;</li>
            <li>routes folder contains the routing files, which for this project is a single file containing all properties related route, but in a real case scenario would contain different route files for different entities;</li>
            <li>controller folder is the folder that contains the controller files that will define the request/response functionality for the different routing files we might have, in this case a single controller.js to implement the routes.js requests/responses for each route.</li>
        </ul>
</ul>

Keep in mind that to make this project more challenging and also to simulate a real case scenario, I will use a SQL DB to store the application data, and the SQL Server will be created locally using HeidiSQL, but you can use any other SQL Server if you wish to test the back-end. I will also attach to this repo, a folder with the .sql file for you to create the DB from scratch on your environment.

I'm going to use SQL because it requires more data processing than NoSQL databases like MongoDB, that already store and return object collections.

## API Endpoints Considerations

Having a UI that sends data to the API, is a good way to control the request parameters and to make sure they fit the expected values, however, it is a good practice to always validate the received data in the back-end also. Having that in mind, my API was designed and built in a way that all the request parameters are checked and validated before the data is fetched or manipulated, making sure the API only responds if the request parameters or request body are the expected ones.

Regarding the GET endpoint that lists all properties, the filtering was built having into account the way Uniplaces actually filters their properties, meaning that more than one filter can be sent, for example, if an individual wants to filter 2,3 and 4 bedroom properties, the API is prepared to do so.

## Exception Handling

The API was designed in a way that for each possible error it may encounter in the back-end, a message is sent to the client. This messages are all user friendly and inform the user of what may have caused the issue.

This message was also designed in a way that in the front-end code there is almost no need to do exception handling to the received responses, meaning that I simply verify if the received JSON file contains the key named "message" and if it does, then output it. Some of the messages are successful ones too, what changes is the Status Code, and in the front-end I simply use a Sweet Alert to output the request result, whether it is successful or not.

## Database SQL File

In this Repository you can also find a folder called DataBase, and there you find the SQL file that you can use to reproduce the DB I created, including the Unit naming lookup table.

![Image description](https://github.com/PedroSousa97/Technical-Challenge-Backend-NodeJS/blob/master/Database/DBDiagram.PNG)

## Delivery Date

Wednesday (26/05)

## Author

Pedro Henrique Santos Sousa
