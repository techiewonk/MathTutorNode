//videochat.js
/**
* Publishes videostreams of both student and tutor
* Automatically detects when a new user (tutor or student) has "subscribed" to the video session 
*/

//Initializes session 
var session = OT.initSession(sessionId);

//Determines Video Dimensions
var options = {
	insertMode: 'append',
	width: 480,
	height: 320
};

var publisher = OT.initPublisher("publisher", options);

//Stream of the "publisher" is shown on the page 
session.connect(apiKey, token, function(err, info) {
  if(err) {
    alert(err.message || err);
  }
  session.publish(publisher);
});

//Streams of "subscribers" joining the session are show on the page
session.on('streamCreated', function(event,err) {
	
  if (err) {
   showMessage('Streaming connection failed');
   }
	
   session.subscribe(event.stream, "subscribers", options);
   
   });
	
session.on("streamDestroyed", function (event) {
  console.log("Stream stopped. Reason: " + event.reason);
});
