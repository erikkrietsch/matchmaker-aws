var matchmaker = require('./lib/matchmaker')

exports.getPlayers = function (event, context, callback) {
	matchmaker.getPlayers(event, callback)
};
