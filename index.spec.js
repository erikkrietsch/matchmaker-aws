'use strict'

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var rewire = require('rewire')
var index = rewire('./index.js')
var Promise = require('bluebird')
var exceptions = require('./lib/exceptions')

chai.use(function (chai, utils) {
  var Assertion = chai.Assertion;

  Assertion.addProperty('validResponse', function () {
    var obj = this._obj;
    this.assert(obj.body !== undefined, "body should not be undefined", "body should be undefined")
    this.assert(!isNaN(obj.statusCode), "expected statusCode to be a number", "expected statusCode to be NaN")
  });
});


describe("index", () => {
  beforeEach(() => {
    this.player = { id: 1, name: "Joe Yo" }
    this.players = [this.player]
    this.listPlayers = (event) => {
      return Promise.resolve(this.players)
    }
    this.getPlayer = (event) => {
      return Promise.resolve(this.player)
    }
    this.matchmaker = {
      listPlayers: this.listPlayers,
      getPlayer: this.getPlayer
    }
    index.__set__("matchmaker", this.matchmaker)
  })

  describe("listPlayers", (done) => {
    it("should call the callback with player data", done => {
      index.listPlayers({}, {}, (err, response) => {
        expect(err).to.be.null
        expect(JSON.parse(response.body)).to.deep.equal(this.players)
        expect(response).to.be.a.validResponse
        done()
      })
    })

    describe("when there are no players", () => {
      it("should return a 404", done => {
        this.matchmaker.listPlayers = event => {
          return Promise.reject(new exceptions.NotFoundException("not found"))
        }

        index.listPlayers({}, {}, (err, response) => {
          expect(err).to.be.null
          expect(response).to.be.a.validResponse
          expect(response.statusCode).to.equal(404)
          expect(response.body).to.contain("not found")
          done()
        })
      })
    })

  })

  describe("getPlayer", (done) => {
    it("should call the callback with player data", done => {
      let event = { playerId: 1 }
      index.getPlayer(event, {}, (err, obj) => {
        expect(err).to.be.null
        expect(obj).to.be.validResponse
        done()
      })
    })
  })
})