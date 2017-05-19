'use strict'

module.exports.handle = function(error, cb) {
  // console.log(process.argv)
  // console.log(process.argv.some( (arg) => {
  //   arg.includes('mocha')
  // }))
  // console.error("Matchmaker encountered an error", error)
  let response = {
    statusCode: error.code,
    body: error.message
  }
  cb(null, response)
}