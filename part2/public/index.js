var chat = document.getElementById("chat");
var alias = document.getElementById("alias");
var message = document.getElementById("message");

var DATA_NAME = "full_name";
var DATA_MESSAGE = "message";

if(!window.location.hostname){
	window.location.hostname = "localhost";
}

var ws = new WebSocket("ws://" + window.location.hostname + ":9000" + "/");

ws.onopen = function(e){
	console.log("WebSocket connected!");
}

ws.onmessage = function(e){
	console.log("Got a message!");
	var newmessage = JSON.parse(e.data);
	chat.value = chat.value + newmessage[DATA_NAME] + ": " + newmessage[DATA_MESSAGE] + "\n";
	if(chat.value.length > 10000){
		chat.value = chat.value.substr(chat.value.length - 10000);
	}
	chat.scrollTop = chat.scrollHeight;
}

ws.onclose = function(e){
	console.log("WebSocket closed! Server down?");
}

ws.onerror = function(e){
	console.log("WebSocket error! " + JSON.stringify(e));
}

window.onbeforeunload = function(){
	ws.close();
};

function submitMessage(){
	var sendmessage = new Object();
	sendmessage[DATA_NAME] = alias.value;
	sendmessage[DATA_MESSAGE] = message.value;

	message.value = "";
	message.focus();

	ws.send(JSON.stringify(sendmessage));
}

message.focus();

message.addEventListener("keydown", function(e) {
	if(e.keyCode == 13)
	{
		submitMessage();
	}
});
