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
  name: { type: String, required: true },
  age: Number,
  "favoriteFoods": [String]
});

var Person = mongoose.model('Person', personSchema);

//console.log(new Person());

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
    var data = new Person({ name: 'Tung',
                            age: 30,
                            favoriteFoods: ['Foo', 'Bar']});
    data.save(function (err) {
        if (err) return done(err);
        // saved!
    });
    done(null, data);
};

/** 4) Create many People with `Model.create()` */

// Sometimes you need to create many Instances of your Models,
// e.g. when seeding a database with initial data. `Model.create()`
// takes an array of objects like [{name: 'John', ...}, {...}, ...],
// as the 1st argument, and saves them all in the db.
// Create many people using `Model.create()`, using the function argument
// 'arrayOfPeople'.

var createManyPeople = function(arrayOfPeople, done) {
    console.log(JSON.stringify(arrayOfPeople));
    Person.create(arrayOfPeople, function (err, data) {
        if (err) return done(err);
        // saved!
        done(null, data);
    });  
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
  //console.log(JSON.stringify(personName));
  Person.find({name: personName}, function(err, data) {
    if (err) return done(err);
    // saved!
    done(null, data);
  });
};

/** 6) Use `Model.findOne()` */

// `Model.findOne()` behaves like `.find()`, but it returns **only one**
// document, even if there are more. It is especially useful
// when searching by properties that you have declared as unique.
// Find just one person which has a certain food in her favorites,
// using `Model.findOne() -> Person`. Use the function
// argument `food` as search key

var findOneByFood = function(food, done) {
    console.log('findOneByFood: ' + food);
    Person.findOne({favoriteFoods: food}, function(err, data) {
      if (err) return done(err);
      // saved!
      done(null, data);
    });
};

/** 7) Use `Model.findById()` */

// When saving a document, mongodb automatically add the field `_id`,
// and set it to a unique alphanumeric key. Searching by `_id` is an
// extremely frequent operation, so `moongose` provides a dedicated
// method for it. Find the (only!!) person having a certain Id,
// using `Model.findById() -> Person`.
// Use the function argument 'personId' as search key.

var findPersonById = function(personId, done) {
    console.log(JSON.stringify(personId));
    Person.findById(personId, function(err, data) {
      if (err) return done(err);
      // saved!
      done(null, data);
    });
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
  
    console.log(JSON.stringify(personId));
    Person.findById(personId, function(err, person) {
        if (err) return done(err);

        person.favoriteFoods.push(foodToAdd);
        console.log('Found person' + personId + ' and favorite foods = ' + JSON.stringify(person.favoriteFoods));
        
        person.markModified('favoriteFoods');
        person.save(function (err, data) {
            if (err) {
                console.log("Error updating " + personId + " error: " + err);
                return done(err);
            }
            // saved!
            done(null, data);
        });
    });
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

    console.log('findAndUpdate: ' + personName);
    Person.findOneAndUpdate({name: personName}, {age: ageToSet}, 
                            {new: true}, function(err, data) {
        if (err) {
            console.log("Error updating " + personName + " error: " + err);
            return done(err);
        }
        console.log(JSON.stringify(data));
        done(null, data);
    });
};

/** # CRU[D] part IV - DELETE #
/*  =========================== */

/** 10) Delete one Person */

// Delete one person by her `_id`. You should use one of the methods
// `findByIdAndRemove()` or `findOneAndRemove()`. They are similar to the
// previous update methods. They pass the removed document to the cb.
// As usual, use the function argument `personId` as search key.

var removeById = function(personId, done) {
    console.log('removeById: ' + personId);

    Person.findByIdAndRemove(personId, function(err, data) {
        if (err) {
            console.log("Error removing " + personId + " error: " + err);
            return done(err);
        }
        console.log(JSON.stringify(data));
        done(null, data);
    });
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
    console.log('removeManyPeople: ' + nameToRemove);

    Person.remove({name: nameToRemove}, function(err, data){
        if (err) {
            console.log("Error removing " + nameToRemove + " error: " + err);
            return done(err);
        }
        console.log(JSON.stringify(data));
        done(null, data);
    });
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
    console.log('queryChain: ' + foodToSearch);

    Person.find({favoriteFoods: foodToSearch})
            .sort('name')
            .limit(2)
            .select('-age')
            .exec(function(err, data){
                if (err) {
                    console.log("Error queryChain " + foodToSearch + " error: " + err);
                    return done(err);
                }
                console.log(JSON.stringify(data));
                done(null, data);
            });
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

// ----

/** - Challenges - *
********************/ 

/** 1) Install and require `helmet` */

// [Helmet](https://github.com/helmetjs/helmet) helps you secure your
// Express apps by setting various HTTP headers.
// Install the package, then require it.

const helmet = require('helmet');

/** 2) Hide potentially dangerous information - `helmet.hidePoweredBy()` */

// Hackers can exploit known vulnerabilities in Express/Node
// if they see that your site is powered by Express. `X-Powered-By: Express`
// is sent in every request coming from Express by default.

// The `hidePoweredBy` middleware will remove the `X-Powered-By` header.
// You can also explicitly set the header to something else, to throw
// people off. e.g. `helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' })`

// Use `helmet.hidePoweredBy()``

app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));

/** 3) Mitigate the risk of clickjacking - `helmet.frameguard()` */

// Your page could be put in a <frame> or <iframe> without your consent.
// This can result in [clickjacking attacks](https://en.wikipedia.org/wiki/Clickjacking),
// among other things. Clickjacking is a technique of tricking a user into
// interacting with a page different from what the user thinks it is. Often this
// happens using another page put over the framed original, in a transparent layer.
// The `X-Frame-Options` header set by this middleware restricts who can put
// your site in a frame. It has three modes: DENY, SAMEORIGIN, and ALLOW-FROM.

// We don't need our app to be framed, so you should use `helmet.frameguard()`
// passing to it the configuration object `{action: 'deny'}`

 app.use(helmet.frameguard({action: 'deny'}));

/** 4) Mitigate the risk of XSS - `helmet.xssFilter()` */

// Cross-site scripting (XSS) is a very frequent type of attack where malicious
// script are injected into vulnerable pages, on the purpous of stealing sensitive
// data like session cookies, or passwords. The basic rule to lower the risk
// of an XSS attack is simple: **"Never trust user's input"**, so as a developer
// you should always *sanitize* all the input coming from the outside.
// This includes data coming from forms, GET query urls, and even from
// POST bodies. Sanitizing means that you should find and encode the characters
// that may be dangerous e.g. `<`, `>`.
// More Info [here](https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet).

// Modern browsers can help mitigating XSS risk by adoptiong software strategies,
// which often are configurable via http headers.
// The `X-XSS-Protection` HTTP header is a basic protection.  When the browser
// detects a potential injected script using an heuristic filter,
// it changes it, making the script not executable.
// It still has limited support.

// Use `helmet.xssFilter()`

app.use(helmet.xssFilter());

/** 5) Avoid inferring the response MIME type - `helmet.noSniff()` */

// Browsers can use content or MIME sniffing to override response `Content-Type`
// headers to guess and process the data using an implicit content type.
// While this can be convenient in some scenarios, it can also lead to
// some dangerous attacks.
// This middleware sets the X-Content-Type-Options header to `nosniff`,
// instructing the browser to not bypass the provided `Content-Type`.

// Use `helmet.noSniff()`

app.use(helmet.noSniff());

/** 6) Prevent IE from opening *untrusted* HTML - `helmet.ieNoOpen()` */

// Some web applications will serve untrusted HTML for download. By default,
// some versions of Internet Explorer will allow you to open those HTML files
// in the context of your site, which means that an untrusted HTML page could
// start doing bad things inside your pages.
// This middleware sets the `X-Download-Options` header to `noopen`,
// to prevent IE users from executing downloads in the *trusted* site's context.

// Use `helmet.ieNoOpen()`

app.use(helmet.ieNoOpen());

/**  7) Ask browsers to access your site via HTTPS only - `helmet.hsts()` */

// HTTP Strict Transport Security (HSTS) is a web security policy mechanism which 
// helps to protect websites against protocol downgrade attacks and cookie hijacking.
// If your website can be accessed via HTTPS you can ask user's browsers
// to avoid using insecure HTTP. Setting the header `Strict-Transport-Security`
// you instruct  browsers to use HTTPS for all the future requests occurring in a
// specified amount of time. This will work for the requests coming **after**
// the initial request.

// Configure `helmet.hsts()` to instruct browsers to use HTTPS for the next
// **90 days**, passing the config object {maxAge: timeInMilliseconds}. 
// HyperDev already has **hsts** enabled, to override its settings you need to 
// set the field `force` to `true` in the config object. To not alter hyperdev security 
// policy we will intercept and restore the header, after inspecting it for testing.

var ninetyDaysInMilliseconds = 90*24*60*60*1000;

app.use(helmet.hsts({maxAge: ninetyDaysInMilliseconds, force: true}));

//**Note**:
// Configuring HTTPS on a custom website requires the acquisition of a domain,
// and a SSL/TSL Certificate.

/** 8) Disable DNS Prefetching - `helmet.dnsPrefetchControl()` */

// To improve performance, most browsers prefetch DNS records for the links in
// a page. In that way the destination ip is already known when the user clicks on a link.
// This may lead to over-use of the DNS service (if you own a big website,
// visited by millions people...), privacy issues (one eavesdropper could infer
// that you are on a certain page - even if encrypted -, from the links you are
// prefecthing), or page statistics alteration (some links may appear visited
// even if they are not). If you have high security needs you can disable
// DNS prefetching, at the cost of a performance penalty.

// Use `helmet.dnsPrefetchControl()`

app.use(helmet.dnsPrefetchControl());

/** 9) Disable Client-Side Caching - `helmet.noCache()` */

// If you are releasing an update for your website, and you want your users
// to download the newer, more performant and safer version, you can (try to)
// disable caching on client's browser, for your website. It can be useful
// in development too. Caching has performance benefits, and you will lose them,
// use this option only when there is a real need.

// Use helmet.noCache()

app.use(helmet.noCache());

/** 10) Content Security Policy - `helmet.contentSecurityPolicy()` */

// This challenge highlights one promising new defense that can significantly reduce
// the risk and impact of many type of attacks in modern browsers. By setting and
// configuring a Content Security Policy you can prevent the injection of anything
// unintended  into your page. This will protect your app from XSS vulnerabilities,
// undesidered tracking, malicious frames, and much more.
// CSP works by defining  a whitelist of content sources which are trusted, for
// each kind of resource a web page may need to load (scripts, stylesheets,
// fonts, frames,media,  and so on...). There are multiple directives available,
// so a website owner can have a granular control.
// See http://www.html5rocks.com/en/tutorials/security/content-security-policy/ ,
// https://www.keycdn.com/support/content-security-policy/ for more details.
// Unfortunately CSP in unsupported by older browser.
//
// By default, directives are wide open, so it's important to set the `defaultSrc`
// directive (helmet supports both `defaultSrc` and `default-src` naming styles),
// as a fallback for most of the other unspecified directives.
// In this exercise, use `helmet.contentSecurityPolicy()`, and configure it
// setting the `defaultSrc` directive to `["'self'"]` (the list of allowed sources
// must be in an array), in order to trust **only your website address** by default.
// Set also the `scriptSrc` directive so that you will allow scripts to be downloaded
// from your website, and from the domain `trusted-cdn.com`.
//
// **Hint**: 
// in the `"'self'"` keyword, the single quotes are part of the keyword itself, 
// so it needs to be enclosed in **double quotes** to be working.

app.use(helmet.contentSecurityPolicy({directives: {defaultSrc: ["'self'"], 
                                                    scriptSrc: ["'self'", 'trusted-cdn.com']}}));

/** TIP: */ 

// `app.use(helmet())` will automatically include all the middleware
// presented above, except `noCache()`, and `contentSecurityPolicy()`,
// but these can be enabled if necessary. You can also disable or 
// set any other middleware individually, using a configuration object.

// // - Example - 
// app.use(helmet({
//   frameguard: {              // configure
//     action: 'deny'
//   },
//   contentSecurityPolicy: {   // enable and configure
//    directives: {
//      defaultSrc: ["'self'"],
//      styleSrc: ['style.com'],
//    }
//   },
//  dnsPrefetchControl: false   // disable
// }))

// We introduced each middleware separately, for teaching purpose, and for
// ease of testing. Using the 'parent' `helmet()` middleware is easiest, and
// cleaner, for a real project.

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

// module.exports = app;
// var api = require('./server.js');
// app.use(express.static('public'));
// app.disable('strict-transport-security');
// app.use('/_api', api);
// app.get("/", function (request, response) {
//   response.sendFile(__dirname + '/views/index.html');
// });
// var listener = app.listen(process.env.PORT || 3000, function () {
//   console.log('Your app is listening on port ' + listener.address().port);
// });

// module.exports = app;
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

