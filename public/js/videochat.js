var sessionIdList = [];
sessionIdList.push(sessionId);


for(var i=0; i < sessionIdList.length; i++){

var session = OT.initSession(sessionIdList[i]);


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

};
