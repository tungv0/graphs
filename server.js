var fs = require('fs');
const path = require('path');
const express = require('express');
const bGround = require('fcc-express-bground');
const myApp = require('./myApp');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'build')));

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/build/index.html');
});

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }
})

// app.listen(PORT, error => {
//   error
//   ? console.error(error)
//   : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`)
// });

bGround.setupBackgroundApp(app, myApp, __dirname).listen(PORT, function(){
  bGround.log('Node is listening on port '+ PORT + '...');
  bGround.log("Hello World");
});