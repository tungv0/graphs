require('dotenv').config();

const fs = require('fs');
const path = require('path');
const bGround = require('fcc-express-bground');
const express = require('express');
const myApp = require('./myApp');
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 8080;
const mongoose = require('mongoose');
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
  console.log(Person.modelName);
  if(req.method !== 'OPTIONS' && Person.modelName !== 'Person') {
    console.log('middleware: ' + Person.modelName);
    return next({message: 'Person Model is not correct'});
  }
  next();
});

router.post('/mongoose-model', function(req, res, next) {
  // try to create a new instance based on their model
  // verify it's correctly defined in some way
  var p;
  console.log(`instantiate Person model: ${req.body}`);
  p = new Person(req.body);
  console.log(JSON.stringify(p));
  res.json(p);
});

var createPerson = require('./myApp.js').createAndSavePerson;
router.get('/create-and-save-person', function(req, res, next) {
  // in case of incorrect function use wait timeout then respond
  var t = setTimeout(() => { next({message: 'timeout'}) }, timeout);
  createPerson(function(err, data) {
    clearTimeout(t);
    if(err) { return (next(err)); }
    if(!data) {
      console.log('Missing `done()` argument');
      return next({message: 'Missing callback argument'});
    }
     Person.findById(data._id, function(err, pers) {
       if(err) { return (next(err)); }
       res.json(pers);
       pers.remove();
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
  var t = setTimeout(() => { next({message: 'timeout'}) }, timeout);
  var p = new Person(req.body);
  p.save(function(err, pers) {
    if(err) { return next(err) }
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
  var t = setTimeout(() => { next({message: 'timeout'}) }, timeout);
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

app.listen(PORT, error => {
  error
  ? console.error(error)
  : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`)
});

// bGround.setupBackgroundApp(app, myApp, __dirname).listen(PORT, function(){
//   bGround.log('Node is listening on port '+ PORT + '...');
// });


