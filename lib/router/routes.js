'use strict'

var matchmaker = require('../matchmaker')
var graph = require('../graph')

module.exports = {
  "/players": [
    { method: "GET", func: matchmaker.listPlayers }
  ],
  "/players/{playerId}": [
    { method: "GET", func: matchmaker.getPlayer }
  ],
  "/graph": [
    { method: "GET", func: graph.query },
    { method: "POST", func: graph.query }
  ]
}
