var matchmaker = require('./lib/matchmaker')
var error = require('./lib/error')

exports.listPlayers = function (event, context, callback) {
	matchmaker.listPlayers(event)
	.then(response => {
		callback(null, response)
	})
	.catch(err => error.handle(err, callback))
};
