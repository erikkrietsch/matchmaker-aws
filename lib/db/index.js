'use strict'

var Promise = require('bluebird')
var pg = Promise.promisifyAll(require('pg'))
var queries = require('./queries.js')
var exceptions = require('../exceptions')

function createClient() {
  return new pg.Client()
}

function Database() {
}

Database.prototype.fetch = function(query, params) {
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
  return this.fetch(queries.fetchPlayer, [playerId])
  .then(results => {
    if (!results.rows || !results.rows.length) {
      throw new exceptions.NotFoundException("Player not found")
    }
    return results
  })
}

let database = new Database()

module.exports = database