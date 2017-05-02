'use strict';

let path            = require('path'),
    express         = require('express'),
    https 			= require('https'),
    http 			= require('http'),
			logger				= require('morgan'),

    fs 				= require('fs');

const PORT = process.env.PORT ? process.env.PORT : 8080;
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';
const CERT_DIR = process.env.CERT_DIR || __dirname;
const SECURE_PORT = 8443;
/**********************************************************************************************************/

// Setup our Express pipeline
let app = express();
// Setup pipeline support for static pages
app.use(express.static(path.join(__dirname, 'public')));
// Setup pipeline support for server-side templates
app.engine('pug', require('pug').__express);
app.use(logger('dev'));
// redirect to https if available
if (SECURE_PORT) {
	app.use (function (req, res, next) {
		if (req.secure) {
			next();
		} else {
			res.redirect('https://' + req.hostname +':'+SECURE_PORT+ req.url);
		}
	});
}
app.set('views', __dirname);


/**********************************************************************************************************/

// Give them the base page
app.get('*', (req, res) => {
    res.send(__dirname + '/public/index.html');
});

/**********************************************************************************************************/


let httpServer = http.Server(app).listen(PORT, () => {
	console.log('listening on unsecure port: ' + PORT);
});

if (SECURE_PORT) {
	const SSL_OPTIONS = {
		key: fs.readFileSync(CERT_DIR + '/key.pem'),
		cert: fs.readFileSync(CERT_DIR + '/cert.pem')
	};
	let httpsServer = https.createServer(SSL_OPTIONS, app);
	httpsServer.listen(SECURE_PORT);
	console.log('listening on secure port: ',SECURE_PORT);

}