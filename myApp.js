const fs = require('fs');
const dns = require('dns');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer'); // v1.0.5
const upload = multer({ dest: 'upload/'}); // for parsing multipart/form-data
const type = upload.single('upfile');

const app = express();
const mongoose = require('mongoose');

var name = '';
var shortenedURL = {};

// --> 7)  Mount the Logger middleware here
app.use(
    function(request, response, next) {
        console.log(`${request.method} ${request.path} - ${request.ip}`);
        next();
    }
);

// --> 11)  Mount the body-parser middleware  here
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: false}));

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
app.get('/:word/echo',
    function(request, response) {
        console.log(`${request.method} ${request.path} - ${request.params}`);
        response.send({echo: request.params.word});
    }
);

/** 10) Get input from client - Query parameters */
// /name?first=<firstname>&last=<lastname>
app.route('/name').get(
    function(request, response) {
        let fullName = '';

        if (request.query.first && request.query.last) {
            fullName = request.query.first + ' ' + request.query.last;
        }
        
        console.log(`${request.method} ${request.path} - ${JSON.stringify(request.query)}`);
        console.log(`name: ${name}, fullName: ${fullName}`);
        response.send({name: fullName ? fullName : name});
}).post(
    function(request, response){
        console.log(`${request.method} ${request.path} - ${JSON.stringify(request.body)}`);
        name = request.body.first + ' ' + request.body.last;
        response.send({name: name});
});
  
/** 11) Get ready for POST Requests - the `body-parser` */
// place it before all the routes !


/** Project 1) timestamp server  */
app.get('/api/timestamp/:date_string', 
    function(request, response) {
        console.log(`${request.method} ${request.path} - ${JSON.stringify(request.params)}`);
        let str = request.params.date_string;
        let date = undefined;

        if (str) {
            if (/-/.test(str)) { // GMT time string
                date = new Date(str);
            } else {             // millisecond time string
                date = new Date(parseInt(str, 10));
            }
        } else { // empty string, use current time.
            date = Date.now();
        }


        if (isNaN(date.getTime())) {
            console.log(`Invalid date: ${str}`);
            response.send({"error" : "Invalid Date" });
        } else {
            response.send({
                "unix": date.getTime(),
                "utc": date.toUTCString()
            });
        }
    }
);

/** Project 2) whoami  */
app.get('/api/whoami', 
    function(request, response) {
        let headers = request.headers;
        response.send({
            ipaddress: headers["x-forwarded-for"],
            language: headers["accept-language"],
            software: headers["user-agent"]
        });
    }
);

/** Project 3) URL shortener */
app.post('/api/shorturl/new',
    function(request, response) {        
        let url = request.body.url;
        let key = Object.keys(shortenedURL).length;

        dns.lookup(url.replace(/(^\w+:|^)\/\//, ''), function(err, address){
            if (err) {
                console.log(`shorturl invalid URL (${url}): ${err}`);
                response.send({error: "invalid URL"});
            } else {
                shortenedURL[key] = url;
                response.send({
                    original_url: url,
                    short_url: key
                });
                console.log(`current list of shortened URLs: ${JSON.stringify(shortenedURL)}`);
            }
        });
    }
);

app.get('/api/shorturl/:id', 
    function(request, response) {
        let url = shortenedURL[request.params.id];

        console.log(`looking up shortened url ${request.params.id}: ${url}`);
        response.redirect(url);
    }
);

/** Project 5: File Analyzer */
app.post('/api/fileanalyse', type,
    function(request, response) {
        console.log(JSON.stringify(request.file));

        /** {"fieldname":"upfile","originalname":"[DRAFT] SRE Job Descriptions.pdf",
         * "encoding":"7bit","mimetype":"application/pdf","destination":"upload/",
         * "filename":"70307ca3d5a644ebd0e61ba38fdca827","path":"upload/70307ca3d5a644ebd0e61ba38fdca827","size":57066} */

        // Response format {"name":"[DRAFT] SRE Job Descriptions.pdf","type":"application/pdf","size":57066}
        response.send({
            name: request.file.originalname,
            type: request.file.mimetype,
            size: request.file.size
        });
    }
);

// ph5bbcb351df3bb

/**********************************************
* 3. FCC Mongo & Mongoose Challenges
* ==================================
***********************************************/

/** # MONGOOSE SETUP #
/*  ================== */

/** 1) Install & Set up mongoose */

// Add `mongodb` and `mongoose` to the project's `package.json`. Then require 
// `mongoose`. Store your **mLab** database URI in the private `.env` file 
// as `MONGO_URI`. Connect to the database using `mongoose.connect(<Your URI>)`

// mongoose.connect(process.env.MONGO_URI);

/** # SCHEMAS and MODELS #
/*  ====================== */

/** 2) Create a 'Person' Model */

// First of all we need a **Schema**. Each schema maps to a MongoDB collection
// and defines the shape of the documents within that collection. Schemas are
// building block for Models. They can be nested to create complex models,
// but in this case we'll keep things simple. A model allows you to create
// instances of your objects, called **documents**.

// Create a person having this prototype :

// - Person Prototype -
// --------------------
// name : string [required]
// age :  number
// favoriteFoods : array of strings (*)

// Use the mongoose basic *schema types*. If you want you can also add more
// fields, use simple validators like `required` or `unique`, and set
// `default` values. See the [mongoose docs](http://mongoosejs.com/docs/guide.html).

// <Your code here >

const Schema = mongoose.Schema;

var personSchema = new Schema({
  name:             { type: String, required: true },
  age:              { type: Number, default: 0 },
  favoriteFoods:    [String]
});

console.log(`person schema: ${JSON.stringify(personSchema)}`);

var Person = mongoose.model('Person', personSchema);

console.log(`person model: ${JSON.stringify(Person)}`);

// **Note**: GoMix is a real server, and in real servers interactions with
// the db are placed in handler functions, to be called when some event happens
// (e.g. someone hits an endpoint on your API). We'll follow the same approach
// in these exercises. The `done()` function is a callback that tells us that
// we can proceed after completing an asynchronous operation such as inserting,
// searching, updating or deleting. It's following the Node convention and
// should be called as `done(null, data)` on success, or `done(err)` on error.
// **Warning** - When interacting with remote services, **errors may occur** !

// - Example -
// var someFunc = function(done) {
//   ... do something (risky) ...
//   if(error) return done(error);
//   done(null, result);
// };

/** # [C]RUD part I - CREATE #
/*  ========================== */

/** 3) Create and Save a Person */

// Create a `document` instance using the `Person` constructor you build before.
// Pass to the constructor an object having the fields `name`, `age`,
// and `favoriteFoods`. Their types must be conformant to the ones in
// the Person `Schema`. Then call the method `document.save()` on the returned
// document instance, passing to it a callback using the Node convention.
// This is a common pattern, all the **CRUD** methods take a callback 
// function like this as the last argument.

// - Example -
// ...
// person.save(function(err, data) {
//    ...do your stuff here...
// });

var createAndSavePerson = function(done) {
  
  done(null /*, data*/);

};

/** 4) Create many People with `Model.create()` */

// Sometimes you need to create many Instances of your Models,
// e.g. when seeding a database with initial data. `Model.create()`
// takes an array of objects like [{name: 'John', ...}, {...}, ...],
// as the 1st argument, and saves them all in the db.
// Create many people using `Model.create()`, using the function argument
// 'arrayOfPeople'.

var createManyPeople = function(arrayOfPeople, done) {
    
    done(null/*, data*/);
    
};

/** # C[R]UD part II - READ #
/*  ========================= */

/** 5) Use `Model.find()` */

// Find all the people having a given name, using `Model.find() -> [Person]`
// In its simplest usage, `Model.find()` accepts a **query** document (a JSON
// object ) as the first argument, and returns an **array** of matches.
// It supports an extremely wide range of search options. Check it in the docs.
// Use the function argument `personName` as search key.

var findPeopleByName = function(personName, done) {
  
  done(null/*, data*/);

};

/** 6) Use `Model.findOne()` */

// `Model.findOne()` behaves like `.find()`, but it returns **only one**
// document, even if there are more. It is especially useful
// when searching by properties that you have declared as unique.
// Find just one person which has a certain food in her favorites,
// using `Model.findOne() -> Person`. Use the function
// argument `food` as search key

var findOneByFood = function(food, done) {

  done(null/*, data*/);
  
};

/** 7) Use `Model.findById()` */

// When saving a document, mongodb automatically add the field `_id`,
// and set it to a unique alphanumeric key. Searching by `_id` is an
// extremely frequent operation, so `moongose` provides a dedicated
// method for it. Find the (only!!) person having a certain Id,
// using `Model.findById() -> Person`.
// Use the function argument 'personId' as search key.

var findPersonById = function(personId, done) {
  
  done(null/*, data*/);
  
};

/** # CR[U]D part III - UPDATE # 
/*  ============================ */

/** 8) Classic Update : Find, Edit then Save */

// In the good old days this was what you needed to do if you wanted to edit
// a document and be able to use it somehow e.g. sending it back in a server
// response. Mongoose has a dedicated updating method : `Model.update()`,
// which is directly binded to the low-level mongo driver.
// It can bulk edit many documents matching certain criteria, but it doesn't
// pass the edited document to its callback, only a 'status' message.
// Furthermore it makes validation difficult, because it just
// direcly calls the mongodb driver.

// Find a person by Id ( use any of the above methods ) with the parameter
// `personId` as search key. Add "hamburger" to the list of her `favoriteFoods`
// (you can use Array.push()). Then - **inside the find callback** - `.save()`
// the updated `Person`.

// [*] Hint: This may be tricky if in your `Schema` you declared
// `favoriteFoods` as an `Array` without specifying the type (i.e. `[String]`).
// In that case `favoriteFoods` defaults to `Mixed` type, and you have to
// manually mark it as edited using `document.markModified('edited-field')`
// (http://mongoosejs.com/docs/schematypes.html - #Mixed )

var findEditThenSave = function(personId, done) {
  var foodToAdd = 'hamburger';
  
  done(null/*, data*/);
};

/** 9) New Update : Use `findOneAndUpdate()` */

// Recent versions of `mongoose` have methods to simplify documents updating.
// Some more advanced features (i.e. pre/post hooks, validation) beahve
// differently with this approach, so the 'Classic' method is still useful in
// many situations. `findByIdAndUpdate()` can be used when searching by Id.
//
// Find a person by `name` and set her age to `20`. Use the function parameter
// `personName` as search key.
//
// Hint: We want you to return the **updated** document. In order to do that
// you need to pass the options document `{ new: true }` as the 3rd argument
// to `findOneAndUpdate()`. By default the method
// passes the unmodified object to its callback.

var findAndUpdate = function(personName, done) {
  var ageToSet = 20;

  done(null/*, data*/);
};

/** # CRU[D] part IV - DELETE #
/*  =========================== */

/** 10) Delete one Person */

// Delete one person by her `_id`. You should use one of the methods
// `findByIdAndRemove()` or `findOneAndRemove()`. They are similar to the
// previous update methods. They pass the removed document to the cb.
// As usual, use the function argument `personId` as search key.

var removeById = function(personId, done) {
  
  done(null/*, data*/);
    
};

/** 11) Delete many People */

// `Model.remove()` is useful to delete all the documents matching given criteria.
// Delete all the people whose name is "Mary", using `Model.remove()`.
// Pass to it a query ducument with the "name" field set, and of course a callback.
//
// Note: `Model.remove()` doesn't return the removed document, but a document
// containing the outcome of the operation, and the number of items affected.
// Don't forget to pass it to the `done()` callback, since we use it in tests.

var removeManyPeople = function(done) {
  var nameToRemove = "Mary";

  done(null/*, data*/);
};

/** # C[R]UD part V -  More about Queries # 
/*  ======================================= */

/** 12) Chain Query helpers */

// If you don't pass the `callback` as the last argument to `Model.find()`
// (or to the other similar search methods introduced before), the query is
// not executed, and can even be stored in a variable for later use.
// This kind of object enables you to build up a query using chaining syntax.
// The actual db search is executed when you finally chain
// the method `.exec()`, passing your callback to it.
// There are many query helpers, here we'll use the most 'famous' ones.

// Find people who like "burrito". Sort them alphabetically by name,
// Limit the results to two documents, and hide their age.
// Chain `.find()`, `.sort()`, `.limit()`, `.select()`, and then `.exec()`,
// passing the `done(err, data)` callback to it.

var queryChain = function(done) {
  var foodToSearch = "burrito";
  
  done(null/*, data*/);
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

/** # Further Readings... #
/*  ======================= */
// If you are eager to learn and want to go deeper, You may look at :
// * Indexes ( very important for query efficiency ),
// * Pre/Post hooks,
// * Validation,
// * Schema Virtuals and  Model, Static, and Instance methods,
// * and much more in the [mongoose docs](http://mongoosejs.com/docs/)


//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

module.exports = app;
exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;

