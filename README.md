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

Keep in mind that to make this project more challenging and also to simulate a real case scenario, I will probably use an AZURE SQL DB to store the application data. I'm going to use SQL because it requires more data processing than NoSQL databases like MongoDB, that already store and return object collections. I'll set up the SQL Server in a way that any IP address can access it, so that if you want to test the API and application overall, you are able to do so.

## Author

Pedro Henrique Santos Sousa
