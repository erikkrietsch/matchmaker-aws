'use strict'

var expect = require('chai').expect
var sinon = require('sinon')
var rewire = require('rewire')
var matchmaker = rewire('./index.js')
var Promise = require('bluebird')
var exceptions = require('../exceptions')

describe('Matchmaker', function() {
	beforeEach(function() {
		this.playerData = {
			rows: [
				{
					id: 1,
					first_name: "Player",
					last_name: "One"
				},
				{
					id: 2,
					first_name: "Player",
					last_name: "Two"
				}
			]
		}
		this.db = {
			fetchPlayers: () => { return Promise.resolve(this.playerData.rows) },
			fetchPlayer: (playerId) => {
				this.fetchPlayerCalledWith = playerId
				let player = this.playerData.rows.filter(player => player.id == playerId)[0]
				return Promise.resolve(player)
			}
		}

		matchmaker.__set__("db", this.db)
	})

	describe('listPlayers', function() {
		it('should return the players', function(done) {
			var players = this.playerData.rows;
			matchmaker.listPlayers()
			.then(result => {
				expect(result).to.deep.equal(players)
				done()
			})
			.catch(err => {
				done(err)
			})
		})
	})

	describe('getPlayer', function() {
		it('should return a single player', function(done) {
			let players = this.playerData.rows;
			let event = { pathParameters: { playerId: 1 } }
			matchmaker.getPlayer(event)
			.then(result => {
				expect(result).to.deep.equal(players[0])
				done()
			})
			.catch(err => {
				done(err)
			})
		})

		it('should return a ValidationException when the playerId is not provided', function(done) {
			let players = this.playerData.rows;
			let event = { pathParameters: { } }

			matchmaker.getPlayer(event)
			.then(result => {
				done("should have thrown a ValidationException")
			})
			.catch(err => {
				expect(err.name).to.equal("ValidationException")
				expect(err.message).to.contain("playerId was not provided")
				done()
			})
		})

		it('should return a coerce the value when the playerId is not an integer', function(done) {
			let players = this.playerData.rows;
			let event = { pathParameters: { playerId: "2.1" } }

			matchmaker.getPlayer(event)
			.then(result => {
				expect(this.fetchPlayerCalledWith).to.equal(2)
				done()
			})
			.catch(err => {
				done(err)
			})
		})
	})
})
