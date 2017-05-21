//emailtutor.js
/**
* Sends email the link of the Opentok Videochat Session to the Tutor
*/
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var exports = module.exports = {};

//Takes chatURL and tutorEmailAddress as parameters
exports.sendEmail = function(chatURL, tutorEmailAddress){

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'mathboosttutoring@gmail.com', //password: mathboost2017
    clientId: '712036551031-t5p5o9bmdk5vvottpbsg12orgvtshel6.apps.googleusercontent.com',
    clientSecret: 'fbMgoZlTRhNbQY-N05c_07Qo',
    refreshToken: '1/HziSv3P0iTyXJ5lWHht1BRYhG6lpH4a6WLnX06jlxs0',
    accessToken: 'ya29.GltRBJjZbr8BhjFRRTJ5NYuv-rZKLYYbdNgxmYojmDBX9KalwHwWFdnyJt4ZeTMVNuM7WBWIeXZc714zeZfoY-Qp-VtQ5IQJ7J7eYL4hmPrQDPwhlAynNVhkrevZ',
  },
  
  tls: { 
		rejectUnauthorized: false 
	}
});


// setup email data with unicode symbols
var mailOptions = {
    from: 'Mathboost <mathboosttutoring@gmail.com>', // sender address
    to: tutorEmailAddress, // list of receivers
	
    subject: 'Your Videochat Link', // Subject line
	html: "Link to video chat: " + chatURL
	
    
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function (err, res){
    if (err) {
        return console.log(err);
    }
    console.log('Email Sent');
});
	
}