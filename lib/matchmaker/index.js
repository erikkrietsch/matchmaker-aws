'use strict'

var db = require('../db')
var exceptions = require('../exceptions')

exports.listPlayers = function(event) {
	return db.fetchPlayers()
}

exports.getPlayer = function(event) {
	let playerId = parseInt(event.pathParameters.playerId, 10)
	if (!playerId) return Promise.reject(new exceptions.ValidationException("playerId was not provided"))
	if (isNaN(playerId)) return Promise.reject(new exceptions.ValidationException("playerId must be a number"))

	return db.fetchPlayer(playerId)
}
