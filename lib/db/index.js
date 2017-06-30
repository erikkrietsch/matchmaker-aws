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
  .then(results => results.rows)
  .catch((err) => {
    console.error(JSON.stringify(err))
    throw err
  })
  .finally(() => {
    db.end()
  })
}

Database.prototype.fetchPlayers = function() {
  return this.fetch(queries.fetchPlayers)
}

Database.prototype.fetchPlayer = function(playerId) {
  return this.fetch(queries.fetchPlayer, [playerId])
  .then(results => {
    if (!results || !results.length) {
      throw new exceptions.NotFoundException()
    }
    return results[0]
  })
}

Database.prototype.setPlayerAvailability = function(playerId, isAvailable) {
  return this.fetch(queries.setPlayerAvailability, [playerId, isAvailable ? 't' : 'f'])
  .get(0)
}

let database = new Database()

module.exports = database