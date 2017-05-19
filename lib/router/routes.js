'use strict'

var matchmaker = require('../matchmaker')

module.exports = {
  "/players": [
    { method: "GET", func: matchmaker.listPlayers }
  ],
  "/players/{playerId}": [
    { method: "GET", func: matchmaker.getPlayer }
  ]
}
