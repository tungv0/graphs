const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();


// --> 7)  Mount the Logger middleware here
app.use(
    function(request, response, next) {
        console.log(`${request.method} ${request.path} - ${request.ip}`);
        next();
    }
);

// --> 11)  Mount the body-parser middleware  here


/** 1) Meet the node console. */
console.log("Hello World");

/** 2) A first working Express Server */
// app.get('/', function(request, response) {
//     response.send("Hello Express");
// });

/** 3) Serve an HTML file */
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

/** 4) Serve static assets  */
app.use(express.static(path.join(__dirname, 'public')));

/** 5) serve JSON on a specific route */
app.get('/json', function(request, response) {
    let message = "Hello json";
    
    response.json({
        "message": (process.env.MESSAGE_STYLE == "uppercase") ? message.toUpperCase() : message,
        "MESSAGE_STYLE": process.env.MESSAGE_STYLE
    });
});

/** 6) Use the .env file to configure the app */
 
 
/** 7) Root-level Middleware - A logger */
//  place it before all the routes !


/** 8) Chaining middleware. A Time server */
app.get('/now', 
    function(request, response, next) {
        request.time = new Date().toString();
        console.log(`${request.method} ${request.path} - ${request.time}`);
        next();
    },
    function(request, response) {
        response.send({time: request.time});
    }
);

/** 9)  Get input from client - Route parameters */
app.get('/echo/:word',
    function(request, repsonse) {
        console.log(`${request.method} ${request.path} - ${request.params}`);
        response.send({echo: request.params.word});
    }
);

/** 10) Get input from client - Query parameters */
// /name?first=<firstname>&last=<lastname>

  
/** 11) Get ready for POST Requests - the `body-parser` */
// place it before all the routes !


/** 12) Get data form POST  */



// This would be part of the basic setup of an Express app
// but to allow FCC to run tests, the server is already active
/** app.listen(process.env.PORT || 3000 ); */

//---------- DO NOT EDIT BELOW THIS LINE --------------------

 module.exports = app;
