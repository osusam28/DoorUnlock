var pinID='1111';
var timeout=300000;
var title="";

//the cookie 'pin' holds the correct pin until 5 minutes has passed
//the cookie 'timein' holds the last time the user logged in (milliseconds)

$(document).ready(function() {
	if ($.cookie('pin') != pinID) {		//if not logged in or timed out
		loginRedirect();
	}
	if ($.cookie('pin') == pinID) {		//if logged in
		indexRedirect();
		pageTimeout();
		
		// Create a client instance
		client = new Paho.MQTT.Client("iot.eclipse.org", 80, "clientId" + $.now());

		// set callback handlers
		client.onMessageArrived = onMessageArrived;
		//client.onConnectionLost = onConnectionLost;
		
		// connect the client
		client.connect({onSuccess:initConnect});
	}
	
	$("#loginButton").click(function() {	//When the login button is clicked
		if ($("#pin").val()==pinID) {
			$.cookie('pin', '1111');
			$.cookie('timein', $.now());
			$("#pin").val("");
			window.location = "index.html";
		}
	});
	
	$("#button").click(function() {
		pageTimeout();
		try {
			client.connect({onSuccess:onConnect});
		}
		catch(e) {
			message = new Paho.MQTT.Message("1");
			message.destinationName = "test";
			client.send(message);
		} 
	});
	
	function initConnect() {
	  // Once a connection has been made, make a subscription and send a message.
	  client.subscribe("weblsnr");
	  message = new Paho.MQTT.Message("x");
	  message.destinationName = "test";
	  client.send(message); 
	}
	
	function onConnect() {
	  // Once a connection has been made, make a subscription and send a message.
	  client.subscribe("weblsnr");
	  message = new Paho.MQTT.Message("1");
	  message.destinationName = "test";
	  client.send(message); 
	}
	
	// called when a message arrives
	function onMessageArrived(message) {
	  if (message.payloadString.indexOf("x") == 0) {
		
	  }
	}
	
	// called when the client loses its connection
	//function onConnectionLost(responseObject) {
	//}
	
	function loginRedirect() {
		title = $(document).find("title").text();
		
		if (title.indexOf("Login") == -1) {		//if title doesnt include "Login" then go to login
			window.location = "login.html";
		}
	}

	function indexRedirect() {
		title = $(document).find("title").text();
		
		if (title.indexOf("Home") != -1) {		//if title inclues "Home" go to the devices 
			window.location = "groups.html";
		}
	}

	function pageTimeout() {
		if ((parseInt($.now())-parseInt($.cookie('timein'))) >= timeout) {	//if its been 5 minutes since the last action
			$.removeCookie('pin');
			loginRedirect();
		}
		else {
			$.cookie('timein', $.now());
		}
	}
});