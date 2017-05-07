'use strict'

var db = require('../db')

function success(result) {
	let body = result.rows ? result.rows : result
	let response = {
			statusCode: 200,
			body: JSON.stringify(body)
		}
	return response
}

function error(err) {
	let response = {
		statusCode: 404,
		body: "" //`${err.message}`
	}
	return response
}

exports.listPlayers = function(event) {
	return db.fetchPlayers()
	.then(success)
}

exports.getPlayer = function(event) {
	let playerId = event.pathParameters.playerId
	if (!playerId) return Promise.reject("PlayerID is required")

	return db.fetchPlayer(playerId)
	.then(result => success(result.rows[0]))
	.catch(err => error(err))
}
