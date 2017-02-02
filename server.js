require('rootpath')();
var libs                =   process.cwd() + '/libs/';
var config              =   require(libs + 'config');
var log                 =   require(libs + 'log')(module);
var express             =   require('express');
var session             =   require('express-session');
var bodyParser          =   require('body-parser');
var expressJwt          =   require('express-jwt');
var methodOverride      =   require('method-override');
var debug               =   require('debug')('restapi');
var db                  =   require('mongoose.js');
var app                 =   express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(session({
    secret: config.get('secret'),
    resave: false,
    saveUninitialized: true
}));

// use JWT auth to secure the api
app.use('/api', expressJwt({
    secret: config.get('secret')
}).unless({
    path: ['/api/users/authenticate', '/api/users/register']
}));

// routes
app.use('/login',       require('./controllers/login.controller'));
app.use('/register',    require('./controllers/register.controller'));
app.use('/app',         require('./controllers/app.controller'));
app.use('/api/users',   require('./controllers/api/users.controller'));
app.use('/api/friends',   require('./controllers/api/friends.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

app.set('port', process.env.PORT || config.get('port') || 3000);

// start server
var server = app.listen(app.get('port'), function () {
    log.info('Express server listening on port ' + app.get('port'));
});