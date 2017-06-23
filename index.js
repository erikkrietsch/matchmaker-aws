'use strict'

var matchmaker = require('./lib/matchmaker')
var router = require('./lib/router')

exports.router = (event, context, callback) => {
	router.route(event)
	.then(results => responsify(200, results))
	.catch(err => responsify(err.code || 400, err.message || null))
	.asCallback(callback)
}

let responsify = (code, body) => {
	return {
		statusCode: code,
		body: typeof body == "object" ? JSON.stringify(body) : body
	}
}