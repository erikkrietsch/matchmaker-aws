var matchmaker = require('./lib/matchmaker');

exports.handler = function (event, context, callback) {
	matchmaker.getPlayers(event, callback);
};
