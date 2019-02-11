require('dotenv').config();

const fs = require('fs');
const path = require('path');
const bGround = require('fcc-express-bground');
const express = require('express');
const bodyParser = require('body-parser');
const myApp = require('./myApp');
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 8080;
const mongoose = require('mongoose');
var cors = require('cors');
var runner = require('./test-runner');


mongoose.connect(process.env.MONGO_URI);

// app.use(express.static(path.join(__dirname, 'build')));

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

// app.get('/', function(request, response) {
//   response.sendFile(__dirname + '/build/index.html');
// });

// app.use('/public', express.static(process.cwd() + '/public'));


app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));


// global setting for safety timeouts to handle possible
// wrong callbacks that will never be called
var timeout = 50000;

router.get('/file/*?', function(req, res, next) {
  if(req.params[0] === '.env') { return next({status: 401, message: 'ACCESS DENIED'}) }
  fs.readFile(path.join(__dirname, req.params[0]), function(err, data){
    if(err) { return next(err) }
    res.type('txt').send(data.toString());
  });
});

router.get('/is-mongoose-ok', function(req, res) {
  if (mongoose) {
    res.json({isMongooseOk: !!mongoose.connection.readyState})
  } else {
    res.json({isMongooseOk: false})
  }
});


var Person = require('./myApp.js').PersonModel;
router.use(function(req, res, next) {
  if(req.method !== 'OPTIONS' && Person.modelName !== 'Person') {
    return next({message: 'Person Model is not correct'});
  }
  next();
});

router.post('/mongoose-model', function(req, res, next) {
  // try to create a new instance based on their model
  // verify it's correctly defined in some way
  var p;
  req.body.favoriteFoods = [].concat(req.body["favoriteFoods[]"]);
  console.log('req.body = ' + JSON.stringify(req.body));
  p = new Person(req.body);
  console.log('person instance = ' + JSON.stringify(p));
  res.json(p);
});

var createPerson = require('./myApp.js').createAndSavePerson;
router.get('/create-and-save-person', function(req, res, next) {
  // in case of incorrect function use wait timeout then respond
  var t = setTimeout(() => { next({message: 'createAndSavePerson timeout'}) }, timeout);
  createPerson(function(err, data) {
    clearTimeout(t);
    if(err) { return (next(err)); }
    if(!data) {
      console.log('Missing `done()` argument');
      return next({message: 'Missing callback argument'});
    }
    console.log('looking for Person instance with id: ' + data._id);
     Person.findById("5c59310ad02923002bb5a4aa", function(err, pers) {
       if(err) { return (next(err)); }
       console.log('createPerson: ' + pers);
       res.json(pers);
       if (pers) {
         pers.remove();
       }
     });
  });
});

var createPeople = require('./myApp.js').createManyPeople;
router.post('/create-many-people', function(req, res, next) {
  Person.remove({}, function(err) {
    if(err) { return (next(err)); }
    // in case of incorrect function use wait timeout then respond
    var t = setTimeout(() => { next({message: 'timeout'}) }, timeout);
    createPeople(req.body, function(err, data) {
      clearTimeout(t);
      if(err) { return (next(err)); }
      if(!data) {
        console.log('Missing `done()` argument');
        return next({message: 'Missing callback argument'});
      }
       Person.find({}, function(err, pers){
         if(err) { return (next(err)); }
         res.json(pers);
         Person.remove().exec();
       });
    });
  });
});

var findByName = require('./myApp.js').findPeopleByName;
router.post('/find-all-by-name', function(req, res, next) {
  var t = setTimeout(() => { next({message: 'timeout'}) }, timeout);
  Person.create(req.body, function(err, pers) {
    if(err) { return next(err) }
    findByName(pers.name, function(err, data) {
      clearTimeout(t);
      if(err) { return next(err) }
      if(!data) {
        console.log('Missing `done()` argument');
        return next({message: 'Missing callback argument'});
      }
      res.json(data);
      Person.remove().exec();
    });
  });
});

var findByFood = require('./myApp.js').findOneByFood;
router.post('/find-one-by-food', function(req, res, next) {
  var t = setTimeout(() => { next({message: 'findOneByFood timeout'}) }, timeout);

  req.body.favoriteFoods = [].concat(req.body["favoriteFoods[]"]);
  var p = new Person(req.body);

  console.log(JSON.stringify(req.body));
  
  p.save(function(err, pers) {
    if(err) { return next(err) }
    console.log(JSON.stringify(pers));
    findByFood(pers.favoriteFoods[0], function(err, data) {
      clearTimeout(t);
      if(err) { return next(err) }
      if(!data) {
        console.log('Missing `done()` argument');
        return next({message: 'Missing callback argument'});
      }
      res.json(data);
      p.remove();
    });
  });
});

var findById = require('./myApp.js').findPersonById;
router.get('/find-by-id', function(req, res, next) {
  var t = setTimeout(() => { next({message: 'findPersonById timeout'}) }, timeout);
  var p = new Person({name: 'test', age: 0, favoriteFoods: ['none']});
  p.save(function(err, pers) {
    if(err) { return next(err) }
    findById(pers._id, function(err, data) {
      clearTimeout(t);
      if(err) { return next(err) }
      if(!data) {
        console.log('Missing `done()` argument');
        return next({message: 'Missing callback argument'});
      }
      res.json(data);
      p.remove();
    });
  });
});

var findEdit = require('./myApp.js').findEditThenSave;
router.post('/find-edit-save', function(req, res, next) {
  var t = setTimeout(() => { next({message: 'timeout'}) }, timeout);

  req.body.favoriteFoods = [].concat(req.body["favoriteFoods[]"]);
  var p = new Person(req.body);
  p.save(function(err, pers) {
    if(err) { return next(err) }
    try {
      findEdit(pers._id, function(err, data) {
        clearTimeout(t);
        if(err) { return next(err) }
        if(!data) {
          console.log('Missing `done()` argument');
          return next({message: 'Missing callback argument'});
        }
        res.json(data);
        p.remove();
      });
    } catch (e) {
      console.log(e);
      return next(e);
    }
  });
});

var update = require('./myApp.js').findAndUpdate;
router.post('/find-one-update', function(req, res, next) {
  var t = setTimeout(() => { next({message: 'timeout'}) }, timeout);

  req.body.favoriteFoods = [].concat(req.body["favoriteFoods[]"]);
  var p = new Person(req.body);
  p.save(function(err, pers) {
    if(err) { return next(err) }
    try {
      update(pers.name, function(err, data) {
        clearTimeout(t);
        if(err) { return next(err) }
        if (!data) {
          console.log('Missing `done()` argument');
          return next({ message: 'Missing callback argument' });
        }
        res.json(data);
        p.remove();
      });
    } catch (e) {
      console.log(e);
      return next(e);
    }
  });
});

var removeOne = require('./myApp.js').removeById;
router.post('/remove-one-person', function(req, res, next) {
  Person.remove({}, function(err) {
    if(err) if(err) { return next(err) }
    var t = setTimeout(() => { next({message: 'timeout'}) }, timeout);

    req.body.favoriteFoods = [].concat(req.body["favoriteFoods[]"]);
    var p = new Person(req.body);
    p.save(function(err, pers) {
      if(err) { return next(err) }
      try {
        removeOne(pers._id, function(err, data) {
          clearTimeout(t);
          if(err) { return next(err) }
          if(!data) {
            console.log('Missing `done()` argument');
            return next({message: 'Missing callback argument'});
          }
          console.log(data)
          Person.count(function(err, cnt) {
            if(err) { return next(err) }
            data = data.toObject();
            data.count = cnt;
            console.log(data)
            res.json(data);
          })
        });
      } catch (e) {
        console.log(e);
        return next(e);
      }
    });
  });
});

var removeMany = require('./myApp.js').removeManyPeople;
router.post('/remove-many-people', function(req, res, next) {
  Person.remove({}, function(err) {
    if(err) { return next(err) }
    var t = setTimeout(() => { next({message: 'timeout'}) }, timeout);

    req.body.favoriteFoods = [].concat(req.body["favoriteFoods[]"]);
    Person.create(req.body, function(err, pers) {
      if(err) { return next(err) }
      try {
        removeMany(function(err, data) {
          clearTimeout(t);
          if(err) { return next(err) }
          if(!data) {
            console.log('Missing `done()` argument');
            return next({message: 'Missing callback argument'});
          }
          Person.count(function(err, cnt) {
            if(err) { return next(err) }
            if (data.ok === undefined) {
              // for mongoose v4
               try {
                data = JSON.parse(data);
              } catch (e) {
                console.log(e);
                return next(e);
              }
            }
            res.json({
              n: data.n,
              count: cnt,
              ok: data.ok
            });
          })
        });
      } catch (e) {
        console.log(e);
        return next(e);
      }
    });
  })
});

var chain = require('./myApp.js').queryChain;
router.post('/query-tools', function(req, res, next) {
  var t = setTimeout(() => { next({message: 'timeout'}) }, timeout);
  Person.remove({}, function(err) {
    if(err) if(err) { return next(err) }

    req.body.favoriteFoods = [].concat(req.body["favoriteFoods[]"]);
    Person.create(req.body, function(err, pers) {
      if(err) { return next(err) }
      try {
        chain(function(err, data) {
          clearTimeout(t);
          if(err) { return next(err) }
          if (!data) {
            console.log('Missing `done()` argument');
            return next({ message: 'Missing callback argument' });
          }
          res.json(data);
        });
      } catch (e) {
        console.log(e);
        return next(e);
      }
    });
  })
});

app.use('/_api', router);

app.get('/hello', function(req, res){
  var name = req.query.name || 'Guest';
  res.type('txt').send('hello ' + name);
})

var travellers = function(req, res){
  var data = {};
  if(req.body && req.body.surname) {
    switch(req.body.surname.toLowerCase()) {
      case 'polo' :
        data = {
          name: 'Marco',
          surname: 'Polo',
          dates: '1254 - 1324'
        };
        break;
      case 'colombo' :
        data = {
          name: 'Cristoforo',
          surname: 'Colombo',
          dates: '1451 - 1506'
        };
        break;
      case 'vespucci' :
        data = {
          name: 'Amerigo',
          surname: 'Vespucci',
          dates: '1454 - 1512'
        };
        break;
      case 'da verrazzano':
      case 'verrazzano':
        data = {
          name: 'Giovanni',
          surname: 'da Verrazzano',
          dates: '1485 - 1528'
        };
        break;
      default:
        data = {
          name: 'unknown'
        }
    }
  }
  res.json(data);
};


app.route('/travellers')
  .put(travellers);

var error;
app.get('/_api/get-tests', cors(), function(req, res, next){
  if(error || process.env.SKIP_TESTS) 
    return res.json({status: 'unavailable'});
  next();
},
function(req, res, next){
  if(!runner.report) return next();
  res.json(testFilter(runner.report, req.query.type, req.query.n));
},
function(req, res){
  runner.on('done', function(report){
    process.nextTick(() =>  res.json(testFilter(runner.report, req.query.type, req.query.n)));
  });
});

// Error handler
app.use(function(err, req, res, next) {
  console.log(`SERVER ERROR: ${err}`);
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }
});

// Unmatched routes handler
app.use(function(req, res){
  console.log(`Unmatched route: ${req.method}`);
  if(req.method.toLowerCase() === 'options') {
    res.end();
  } else {
    res.status(404).type('txt').send('Not Found');
  }
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Listening on port " + process.env.PORT);
  if(!process.env.SKIP_TESTS) {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});


module.exports = app; // for testing

function testFilter(tests, type, n) {
  var out;
  switch (type) {
    case 'unit' :
      out = tests.filter(t => t.context.match('Unit Tests'));
      break;
    case 'functional':
      out = tests.filter(t => t.context.match('Functional Tests') && !t.title.match('#example'));
      break;
    default:
      out = tests;
  }
  if(n !== undefined) {
    return out[n] || out;
  }
  return out;
}

// bGround.setupBackgroundApp(app, myApp, __dirname).listen(PORT, function(){
//   bGround.log('Node is listening on port '+ PORT + '...');
// });


