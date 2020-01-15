const express = require('express');
const session = require('express-session');
const uuid = require('uuid/v4');
const body_parser = require('body-parser');

const colors = [ 'red', 'blue', 'black', 'grey' ];

const app = express();

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

app.listen(3000, function() {
    console.log('Listening on localhost:3000');
});
