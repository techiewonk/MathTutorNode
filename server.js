// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8081;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var request = require('request');
var OpenTok = require('opentok');

// ejs setup display images / stylesheets =============================================================

app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// required for Opentok==========================================================

// Opentok API Key and Secret
var apiKey = "45827022",
    apiSecret = "a3e34c57968fb9b6e83119489e05c11145e3ce61";
if (!apiKey || !apiSecret) {
  console.log('You must specify API_KEY and API_SECRET environment variables');
  process.exit(1);
}

// Initialize OpenTok
var opentok = new OpenTok(apiKey, apiSecret);
//Variable keeps track of the session ID for the URL
var sessID;

// Create a session and store it in the express app
opentok.createSession({ mediaMode: 'routed', archiveMode: 'always' },function(err, session) {
  if (err) throw err;
  app.set('sessionId', session.sessionId);

  //initializes sessID to be appended to URL
  sessID = session.sessionId;
    
});





// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
