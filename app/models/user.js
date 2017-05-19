// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
// in the original tutorial the login was based off, there was a section for logging in with facebook
// I've left the schema, but it's inactive - ML
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        firstname   : String,
        lastname    : String,
        job         : String,
        classes     : [String],
        // for future iterations consider the following....  - ML
        // phone (string)
        // isLoggedInNow (boolean)
        // birthday (Date)
        // sessionHistory (Array of videosession objects? Tristan please give input - ML)
        // payment info (hashed strings)
        // resetPassToken (string)
        // resetPassDate (Date, so the token expires)
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    // please figure out how to reset passwords
    // it seems like you're going to have to generate a token, email that to the user
    // check against the Token then allow them to update
    // you'll need to create a view and a route. - ML
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
