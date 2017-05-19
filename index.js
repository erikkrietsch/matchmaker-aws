'use strict'

var matchmaker = require('./lib/matchmaker')
var error = require('./lib/error')
var router = require('./lib/router')

exports.router = (event, context, callback) => {
	router.route(event)
	.then(results => {
		let response = {
			statusCode: 200,
			body: JSON.stringify(results)
		}
		callback(null, response)
	})
	.catch(err => error.handle(err, callback))
}
