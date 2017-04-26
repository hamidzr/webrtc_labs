'use strict';

let path            = require('path'),
    express         = require('express');

let port = process.env.PORT ? process.env.PORT : 8080;
let env = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';

/**********************************************************************************************************/

// Setup our Express pipeline
let app = express();
// Setup pipeline support for static pages
app.use(express.static(path.join(__dirname, 'public')));
// Setup pipeline support for server-side templates
app.engine('pug', require('pug').__express);
app.set('views', __dirname);
// Setup pipeline session support
// app.use(session({
//     name: 'session',
//     secret: 'ohhellyes',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         path: '/',
//         httpOnly: false,
//         secure: false
//     }
// }));

// Connect to mongoBD
// let options = { promiseLibrary: require('bluebird') };
// mongoose.connect('mongodb://localhost:32768/heminggs', options, err => {
//     if (err) console.log(err);
//     else console.log('\t MongoDB connected');
// });

// Import our Data Models
// app.models = {
//     Game: require('./models/game'),
//     User: require('./models/user')
// };

// Import our API Routes
// require('./api/kv/v1/key_value')(app);


/**********************************************************************************************************/

// Give them the base page
app.get('*', (req, res) => {
    // res.render('base.pug', {});
    res.status(404).send('resource not found');
});

/**********************************************************************************************************/

// Run the server itself
let server = app.listen(port, () => {
    console.log('Example app listening on ' + server.address().port);
});