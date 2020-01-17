var url = window.location.href.replace('http', 'ws');
var ws = new WebSocket(url);

ws.onerror = function(event) {
    alert('Websocket connection failed');
};

ws.onmessage = function(message) {
    console.log(message);
};

var input = document.querySelector('#send_message');

input.onkeypress = function(event) {
    if (event.which === 10 || event.which === 13) {
	// send message to server
	ws.send(input.value);
	input.value = '';
    }
};
