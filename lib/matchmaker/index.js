'use strict'

var db = require('../db')
var exceptions = require('../exceptions')

exports.listPlayers = function(event) {
	return db.fetchPlayers()
	.then(results => results.rows)
}

exports.getPlayer = function(event) {
	let playerId = event.pathParameters.playerId
	if (!playerId) return Promise.reject(new exceptions.ValidationException("playerId was not provided"))

	return db.fetchPlayer(playerId)
	.then(result => result.rows[0])
}
