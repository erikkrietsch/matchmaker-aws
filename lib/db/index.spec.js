'use strict'

var expect = require('chai').expect
var sinon = require('sinon')
var rewire = require('rewire')
var db = rewire('./index.js')
var Promise = require('bluebird')
var queries = require('./queries.js')

describe("db", () => {
  beforeEach(() => {
    this.emptyResults = { rows: [] }
    this.queryAsyncSpy = sinon.stub().returns( Promise.resolve(this.emptyResults) ),
    this.connectAsyncSpy = sinon.stub().returns( Promise.resolve({}) ),
    this.endSpy = sinon.spy(),
    this.client = {
      connectAsync: this.connectAsyncSpy,
      queryAsync: this.queryAsyncSpy,
      end: this.endSpy
    }
    this.pg = {
      Client: sinon.stub().returns(this.client)
    }
    db.__set__("pg", this.pg)
  })

  describe("fetch with parameters", () => {
    it("should connect to the database and query it", (done) => {
      db.fetch("asdf", ["1", "2", "3"])
      .then(results => {
        expect(this.connectAsyncSpy.callCount).to.equal(1)
        expect(this.queryAsyncSpy.calledWith("asdf", ["1", "2", "3"])).to.beTrue
        expect(this.endSpy.callCount).to.equal(1)
        done()
      })
    })
  })

  describe("fetch", () => {
    it("should connect to the database and query it", (done) => {
      db.fetch("asdf")
      .then(results => {
        expect(this.connectAsyncSpy.callCount).to.equal(1)
        expect(this.queryAsyncSpy.calledWith("asdf")).to.beTrue
        expect(this.endSpy.callCount).to.equal(1)
        done()
      })
    })
  })

  describe("fetchPlayer", () => {
    it("should call fetch with the proper parameters", (done) => {
      let playerId = 1
      db.fetchPlayer(playerId)
      .then(() => {
        done("spy object should return empty results")
      })
      .catch(err => {
        expect(this.queryAsyncSpy.calledWith(queries.fetchPlayer, [playerId])).to.beTrue
        done()
      })
    })
    it("should return a NotFoundException when there are no matching player records", (done) => {
      let emptyResults = { rows: [] }
      // this.client.queryAsync = () => { return Promise.resolve(emptyResults) }

      db.fetchPlayer(99)
      .then(result => {
        done("should have thrown a NotFoundException")
      })
      .catch(err => {
        expect(err.name).to.equal("NotFoundException")
        done()
      })
    })
  })

  describe("fetchPlayers", () => {
    it("should call fetch with the proper parameters", (done) => {
      db.fetchPlayers()
      .then(() => {
        expect(this.queryAsyncSpy.calledWith(queries.fetchPlayers)).to.be.true
        done()
      })
      .catch(err => {
        done(err)
      })
    })
  })
})