var libs			=		process.cwd() + '/libs/';
var config		=		require(libs + 'config');
var log				=		require(libs + 'log')(module);
var mongoose	=		require('mongoose');

mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;

db.on('error', function (err) {
	log.error('Connection error:', err.message);
});

db.once('open', function callback () {
	log.info("Connected to DB!");
});

module.exports = mongoose;