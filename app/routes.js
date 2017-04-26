//routes.js
var User            = require('../app/models/user');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {

        // form validation


        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PAYMENT SECTIONS =====================
    // =====================================
    // setup braintree
    // process payment
    // redirect to videos tutoring session

    var bodyParser   = require('body-parser');
    var parseUrlEnconded = bodyParser.urlencoded({
      extended: false
    });
    // Braintree Sandbox env. use to connect to Braintree payments.
    // will have to re-factor code in a env file for security (future task)
    var braintree = require('braintree');
    var gateway = braintree.connect({
        environment:  braintree.Environment.Sandbox,
        merchantId:   'pyyjt9v8rfnh2px7',
        publicKey:    'vxk9d968nqydxc5c',
        privateKey:   '062d8f03343c2b75c7b494697d080b89'
    });

    // render payment page
    app.get('/payment', function (request, response) {
      var tutor = {
          firstName: request.query.fname,
          lastName: request.query.lname
        }


      gateway.clientToken.generate({}, function (err, res) {
        response.render('payment', {
          clientToken: res.clientToken,
          tutor: tutor
        });
      });

    });

    //process payment via credit card or paypal
    // if err, redirect to error page, else success html
    app.post('/process', parseUrlEnconded, function (request, response) {

      var transaction = request.body;
      //console.log('test transact', transaction);
      gateway.transaction.sale({
        amount: transaction.amount,
        paymentMethodNonce: transaction.payment_method_nonce,
        customer: {
          firstName: request.user.local.firstname,
          lastName: request.user.local.lastname,
          email: request.user.local.email
        }
      }, function (err, result) {

        if (err) throw err;

        if (result.success) {

 

          response.render('success', {
            customerInfo: {
              id: result.transaction.id,
              firstName: request.user.local.firstname,
              lastName: request.user.local.lastname,
              amt: transaction.amount
            }
          });
        } else {
          response.sendFile('error.html', {
            root: './public'
          });
        }
      });

    });


    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)

    app.get('/profile', isLoggedIn, function(req, res) {

        User.find({},function(err,usrs){
            renderResult(res,usrs,"User List",req.user,'profile')
        });
    });


    // wrote this as a multipurpose function to deliver an array of users
    // to the page. the page will accept the array as 'people'.
    // userlist page - just delivers a full list
    // search page - will deliver a list that fulfills the criteria
    function renderResult(res,usrs=false,msg,user,page){
        //page will change depending on what page is running this function
        res.render(page + '.ejs', {message: msg, people:usrs, user : user},

            function (err,result){
                if (!err){res.end(result);}
                else {res.end('Oops!');
                console.log(err);}

            });
    }

    // =====================================
    // EDIT USER ===========================
    // =====================================

    app.get('/update', isLoggedIn, function(req, res){
        res.render('update.ejs', {
            message: req.flash('updateMessage'),
            user : req.user
        });
    })

    // process the update form
    app.post('/update', isLoggedIn, function(req, res){
        console.log(req.session.passport.user);
        console.log(req.user);
        console.log(req.user.local.email);
        User.update({_id:req.session.passport.user}, {
            'local.firstname' : req.body.firstname
        }, function(err, numberAffected,rawResponse) {
            console.log(req.body.firstname);
            console.log('profile update error');
        });
        //res.render('index.ejs', {
        //    user : req.user
        //});
        // changed this to go to the profile page instead of the index
        // why did I make it go to the index?
        User.find({},function(err,usrs){
            renderResult(res,usrs,"User List",req.user,'profile')
        });
    });

    // =====================================
    // USERLIST SECTION ====================
    // =====================================
    // copied from the profile code
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)

    app.get('/users', isLoggedIn, function(req, res) {
        User.find({},function(err,usrs){
            //console.log("\nUsers: ");
            //console.log(usrs);
            renderResult(res,usrs,"User List",req.user,'users')
        });
    });


    // =====================================
    // SEARCH TUTORS =======================
    // =====================================

    //needs to be written
    app.get('/search', isLoggedIn, function(req,res) {
        renderResult(res,false,"Tutors",req.user,'search')
    });

    app.post('/search', isLoggedIn, function(req,res){
        console.log(req.body.searchbox);

        // currently just searches through first and last names.

        User.find(
            { $and: [       
                {"local.job" : "Tutor"},
                { $or: [{"local.firstname": { $regex : req.body.searchbox, $options : 'i'}},{"local.lastname": { $regex : req.body.searchbox, $options : 'i'}},{"local.classes": { $regex : req.body.searchbox, $options : 'i'}}]}
                ]
            },
            function(err,usrs){
            console.log("\nTutors");
            console.log(usrs);
            renderResult(res,usrs,"Tutors",req.user,'search')
        })

    });




    // =====================================
    // FORGOT PASS =========================
    // =====================================

    //needs to be written

    // =====================================
    // RESET PASS ==========================
    // =====================================

    //needs to be written

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
