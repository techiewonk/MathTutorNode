var sessionIdList = [];
sessionIdList.push(sessionId);

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


for(var i=0; i < sessionIdList.length; i++){

	if(sessionIdList[i] == sessionId){
		session.on('streamCreated', function(event) {
		session.subscribe(event.stream, "subscribers", options);
		});
	}else {
		for(var j=0; j < sessionIdList.length; j++){
			if(sessionIdList[i] == sessionIdList[j]){
				var matchSession = OT.initSession(sessionIdList[j]);
				matchSession.on('streamCreated', function(event) {
				matchSession.subscribe(event.stream, "subscribers", options);
				});
			}
		}
	}
}

