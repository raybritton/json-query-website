require('dotenv').config();

const express = require('express');
const fs = require('fs');
const sprintf = require('sprintf-js').sprintf;
const app = express();

global.SERVER_HOST = process.env.HOSTNAME || 'localhost';
global.SERVER_PORT = process.env.PORT || '3001';

const syntaxDocPage = makeSyntaxDocPage();

app.use(express.static('public'));

app.get('/docs', (req, res) => {
	res.send(syntaxDocPage);
});

app.use(function(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }
	res.status(err.status || 500).send({'error': util.inspect(err)});
});

app.listen(SERVER_PORT, SERVER_HOST);

console.log(sprintf('JQL Website started at %s listening on %s:%s', new Date().toISOString(), SERVER_HOST, SERVER_PORT));

function makeSyntaxDocPage() {
	var data = fs.readFileSync('res/data.json').toString();
	var js = fs.readFileSync('res/info_maker.js').toString();
	var html = fs.readFileSync('res/doc.html').toString();

	return sprintf(html, sprintf(js, data));
}