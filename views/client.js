var url = window.location.href.replace('http', 'ws');
var ws = new WebSocket(url);

ws.onopen = function(event) {
    ws.send('hi!');
}
