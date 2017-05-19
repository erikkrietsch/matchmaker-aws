'use strict'

module.exports.handle = function(error, cb) {
  console.error("Matchmaker encountered an error", error)
  let response = {
    statusCode: error.code,
    body: error.message
  }
  cb(null, response)
}