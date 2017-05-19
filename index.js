'use strict'

var matchmaker = require('./lib/matchmaker')
var error = require('./lib/error')

exports.listPlayers = function (event, context, callback) {
	matchmaker.listPlayers(event)
	.then(results => {
		let response = {
			statusCode: 200,
			body: JSON.stringify(results)
		}
		callback(null, response)
	})
	.catch(err => error.handle(err, callback))
};

exports.getPlayer = function (event, context, callback) {
	matchmaker.getPlayer(event)
	.then(results => {
		let response = {
			statusCode: 200,
			body: JSON.stringify(results)
		}
		callback(null, response)
	})
	.catch(err => error.handle(err, callback))
}
