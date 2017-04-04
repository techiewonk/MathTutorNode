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
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    
    app.get('/profile', isLoggedIn, function(req, res) {
        User.find({},function(err,usrs){
            //console.log("\nUsers: ");
            //console.log(usrs);
            renderResult(res,usrs,"User List",req.user,'profile')
        });
    });

    function renderResult(res,usrs,msg,user,page){
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
        res.render('index.ejs', {
            user : req.user
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
