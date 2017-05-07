'use strict'

var expect = require('chai').expect
var sinon = require('sinon')
var rewire = require('rewire')
var matchmaker = rewire('./index.js')
var Promise = require('bluebird')


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
			fetchPlayers: () => { return Promise.resolve(this.playerData) },
			fetchPlayer: (playerId) => { return Promise.resolve({ rows: this.playerData.rows.filter(player => player.id == playerId) }) }
		}

		matchmaker.__set__("db", this.db)
	})

	describe('listPlayers', function() {
		it('should return a well formed response object with players in the body', function(done) {
			var players = this.playerData.rows;
			matchmaker.listPlayers()
			.then(result => {
				expect(result.statusCode).to.equal(200)
				expect(JSON.parse(result.body)).to.deep.equal(players)
				done()
			})
			.catch(err => {
				done(err)
			})
		})
	})

	describe('getPlayer', function() {
		it('should return a well formed response object with a single player object in the body', function(done) {
			let players = this.playerData.rows;
			let event = { pathParameters: { playerId: 1 } }
			matchmaker.getPlayer(event)
			.then(result => {
				expect(result.statusCode).to.equal(200)
				expect(JSON.parse(result.body)).to.deep.equal(players[0])
				done()
			})
			.catch(err => {
				done(err)
			})
		})
		it('should return a 404 when the player is not found', function(done) {
			let players = this.playerData.rows;
			let event = { pathParameters: { playerId: 99 } }
			matchmaker.getPlayer(event)
			.then(result => {
				expect(result.statusCode).to.equal(404)
				expect(result.body).to.be.empty
				done()
			})
			.catch(err => {
				done(err)
			})
		})
	})
})
