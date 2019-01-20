require('dotenv').config();

const express = require('express');
const fs = require('fs');
const sprintf = require('sprintf-js').sprintf;
const bodyParser = require('body-parser');
const app = express();
const util = require('util');
const request = require('request');
var spawn = require('child-process-promise').spawn;

global.SERVER_HOST = process.env.HOSTNAME || 'localhost';
global.SERVER_PORT = process.env.PORT || '3001';
global.API_KEY = process.env.API_KEY;
global.HISTORY_URL = process.env.HISTORY_URL;

const JQL_LIB = process.env.LIB_PATH || 'res/jq-0.13.3.jar'

const syntaxDocPage = makeSyntaxDocPage();
const jqlPage = fs.readFileSync('res/jql.html').toString();

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/alive', (req, res) => res.sendStatus(200));

app.get('/docs', (req, res) => {
	res.send(syntaxDocPage);
});

app.get('/', (req, res) => {
	res.send(jqlPage);
})

app.post('/', (req, res) => {
	var input = req.body.input || "";
	var query = req.body.query || "";

	if (input == "" || query== "") {
		res.contentType("application/json").send(JSON.stringify({error:{message: "No content"}}));
		return;
	}

	try {
		input = JSON.stringify(JSON.parse(input));
	} catch (err) {
		res.contentType("application/json").send(JSON.stringify({error:{message: "Invalid json"}}));
		return;
	}

	spawn('java', ['-jar', JQL_LIB, '-i', input, '-q', query, '-api'], { capture: [ 'stdout' ]})
    .then(function (result) {
				var data = result.stdout.toString();
				var json = {error:{extra: ""}}
				if (data == "") {
					json = {
						error: {
							message: "Unknown error"
						}
					}
				} else {
					json = JSON.parse(data);
					json.error = json.error || {extra: ""};
				}
				
				json.error.extra = (json.error.extra || "").replace(/\n/g, "<br>");
				res.contentType("application/json").send(JSON.stringify(json));

				request.post({
					json: true,
					url: HISTORY_URL,
					headers: {
						'x-api-key': API_KEY
					},
					body: {
						input: input,
						query: query,
						output: json
					}
			}, function(error, response, body){
				if (error) {
					console.log(error)
				}
			});
    })
    .catch(function (err) {
			console.log(err);
			res.contentType("application/json").send(JSON.stringify({error:{message: "Unknown error"}}));
    });

})

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