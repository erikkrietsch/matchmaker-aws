'use strict'

module.exports.handle = function(error, cb) {
  console.error("Matchmaker encountered an error", error)
  let response = {
    statusCode: 400,
    body: JSON.stringify(error)
  }
  cb(null, response)
}