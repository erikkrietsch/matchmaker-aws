'use strict'

var expect = require('chai').expect
var sinon = require('sinon')
var rewire = require('rewire')
var db = rewire('./index.js')
var Promise = require('bluebird')

describe("db", () => {
  beforeEach(() => {
    this.queryAsyncSpy = sinon.stub().returns( Promise.resolve(this.emptyResults) ),
    this.connectAsyncSpy = sinon.stub().returns( Promise.resolve({}) ),
    this.endSpy = sinon.spy(),
    this.emptyResults = { rows: [] }
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

  describe("fetchWithParameters", () => {
    it("should connect to the database and query it", (done) => {
      db.fetchWithParameters("asdf", ["1", "2", "3"])
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
})