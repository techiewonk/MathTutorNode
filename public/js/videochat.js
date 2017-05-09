
var session = OT.initSession(sessionId);
var options = {
	insertMode: 'append',
	width: 480,
	height: 320
};

var publisher = OT.initPublisher("publisher", options);

session.connect(apiKey, token, function(err, info) {
  if(err) {
    alert(err.message || err);
  }
  session.publish(publisher);
});



session.on('streamCreated', function(event) {
  session.subscribe(event.stream, "subscribers", options);
});


