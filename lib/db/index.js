'use strict'

var Promise = require('bluebird')
var pg = Promise.promisifyAll(require('pg'))
var queries = require('./queries.js')

function createClient() {
  return new pg.Client()
}

function Database() {
}

Database.prototype.fetch = function(query) {
  let db = createClient()
  return db.connectAsync()
  .then(() => db.queryAsync(query))
  .then(results => {
    db.end()
    return results
  })
}

Database.prototype.fetchWithParameters = function(query, params) {
  let db = createClient()
  return db.connectAsync()
  .then(() => db.queryAsync(query, params))
  .then(results => {
    db.end()
    return results
  })
}

Database.prototype.fetchPlayers = function() {
  return this.fetch(queries.fetchPlayers)
}

Database.prototype.fetchPlayer = function(playerId) {
  return this.fetchWithParameters(queries.fetchPlayer, [playerId])
  .then(results => {
    console.log("The results are in", results)
    if (!results.rows || !results.rows.length) {
      throw new Error("Player not found")
    }
    return results
  })
}

let database = new Database()

module.exports = database