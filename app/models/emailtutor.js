//emailtutor.js
/**
* Sends email the link of the Opentok Videochat Session to the Tutor
*/
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var exports = module.exports = {};

//Takes chatURL and tutorEmailAddress as parameters
exports.sendEmail = function(chatURL){

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'mathboosttutoring@gmail.com', //password: mathboost2017
    clientId: '712036551031-t5p5o9bmdk5vvottpbsg12orgvtshel6.apps.googleusercontent.com',
    clientSecret: 'fbMgoZlTRhNbQY-N05c_07Qo',
    refreshToken: '1/IKm1IPRHgQN7P7X93m_-5mpAT_cBAf2m7NiogsYgyrDDMs6Cx-AcP9edXpzYHgca',
    accessToken: 'ya29.Gls-BONj4_Iw0oq9m7b_ehwYf6Un0piB0V67pUWATmb7Ej8kBosaPSSaGXIm6tucfD-qgb4JVGtnCwo_b45eDtL2mqnwqaMbgOdqNTXoDSPQMcBnttL1c9i0JIdO',
  },
  
  tls: { 
		rejectUnauthorized: false 
	}
});


// setup email data with unicode symbols
var mailOptions = {
    from: 'Mathboost <mathboosttutoring@gmail.com>', // sender address
    //to: tutorEmailAddress, // list of receivers
	to: 'tristan1594@yahoo.com', // list of receivers
    subject: 'Your Videochat Link', // Subject line
	html: "Link to video chat: " + chatURL
	
    
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function (err, res){
    if (err) {
        return console.log('Error');
    }
    console.log('Email Sent');
});
	
}



