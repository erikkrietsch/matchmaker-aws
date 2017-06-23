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

this.router = require('./lib/router')
this.route = sinon.stub(this.router, 'route', (event) => {
  if (event.path.includes("reject")) return Promise.reject(new Error("uh oh!"))
  return Promise.resolve("data")
})

index.__set__("router", this.router)

describe("index", () => {
  describe("route", () => {
    let event = {}

    beforeEach(() => {
      event = {
        path: "/players",
        httpMethod: "GET"
      }
    })

    it("should call the router.route method", (done) => {
      index.router(event, null, (err, data) => {
        expect(this.router.route.callCount).to.equal(1)
        expect(this.router.route.calledWith(event)).to.be.true
        done(err)
      })
    })

    it("should include an error when a Promise is rejected", (done) => {
      event.path = "/reject"
      index.router(event, null, (err, response) => {
        expect(err).to.be.null
        expect(response.statusCode).to.equal(400)
        expect(response.body).to.equal("uh oh!")
        expect(response).to.be.validResponse
        done(err)
      })
    })
  })
})