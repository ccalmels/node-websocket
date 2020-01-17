const express = require('express');
const session = require('express-session');
const websocket = require('express-ws');
const uuid = require('uuid/v4');
const body_parser = require('body-parser');

const colors = [ 'red', 'blue', 'black', 'grey' ];
const clients = [];

const app = express();

const wss = websocket(app);

app.set('view engine', 'pug');
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.use(session({
    genid: function(req) {
	return uuid();
    },
    secret: 'some secrets',
    resave: false,
    saveUninitialized: true
}));

app.get('/', function(req, res) {
    if (!colors.length) {
	res.send('too many people');
    } else {
	if (!req.session.color)
	    req.session.color = colors.pop();

	res.render('index', { id: req.sessionID, color: req.session.color } );
    }
});

app.ws('/', function(ws, req) {
    if (!req.session.color) {
	ws.close();
	return;
    }

    clients.forEach(function(client) {
	client.send('<p class="server">' + req.session.color + ' connected</p>');
    });

    clients.push(ws);

    ws.on('close', function(client) {
	clients.splice(clients.indexOf(client), 1);
    });

    ws.on('message', function(msg) {
	console.log(msg + ' from ' + req.session.color);

	var quoted = msg.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

	clients.forEach(function(client) {
	    client.send('<p style="color:' +  req.session.color + ';">' + quoted + '</p>');
	});
    });

    console.log('websocket opened from ' + req.session.color);
});

app.listen(3000, function() {
    console.log('Listening on localhost:3000');
});
