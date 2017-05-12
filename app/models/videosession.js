//videosession.js

var express  = require('express');
var request = require('request');
var OpenTok = require('opentok');

var exports = module.exports = {};



//express app
var videoapp = express();


// Opentok API Key and Secret
var apiKey = "45827022";
var apiSecret = "a3e34c57968fb9b6e83119489e05c11145e3ce61";

// Initialize OpenTok
var opentok = new OpenTok(apiKey, apiSecret);
//Variable keeps track of the session ID for the URL
var sessID;


//Creates a new Opentok Videochat Session
exports.createVideoSession  = function(){
	
	// Create a session and store it in the express app
	opentok.createSession({ mediaMode: 'routed', archiveMode: 'always' },function(err, session) {
		if (err) throw err;
	videoapp.set('sessionId', session.sessionId);

	//initializes sessID to be appended to URL
	sessID = session.sessionId;
	
	console.log("==================" + session.sessionId + "===============");
    
});
};


//Creates and returns opentok Token needed for users to join session
exports.createToken = function() {
	
	var token = opentok.generateToken(videoapp.get('sessionId'), { role: 'moderator' });
	
	return token;
};
	

//return API Key
exports.getAPIKey = function(){
	
	return apiKey;
};

//return API Secret
exports.getAPISecret = function() {
	
	return apiSecret;
};


//returns initialized opentok object
exports.getOpentok = function() {
	
	return opentok;
};


//returns SessionID of videochat session
exports.getSessionID = function(){
	
	return sessID;
};

	



