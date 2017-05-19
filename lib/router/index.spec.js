'use strict'

var expect = require('chai').expect
var rewire = require('rewire')
var sinon = require('sinon')

var router = rewire('./index.js')

describe('router', () => {
  describe('.route', () => {
    beforeEach(() => {
      this.testRouteGet = sinon.stub().returns(Promise.resolve("get"))
      this.testRoutePost = sinon.stub().returns(Promise.resolve("post"))
      this.routes = {
        "/test": [{
          method: "GET",
          func: this.testRouteGet
        },
        {
          method: "POST",
          func: this.testRoutePost
        }]
      }
      router.__set__("routes", this.routes)
    })
    it('should raise an error if the route is not found', (done) => {
      let event = {
        resource: "/error",
        httpMethod: "GET"
      }
      router.route(event)
      .then(() => {
        done("should have errored")
      })
      .catch((err) => {
        expect(err.code).to.equal(404)
        done()
      })
    })
    it('should map a GET route to a function', (done) => {
      let event = {
        resource: "/test",
        httpMethod: "GET"
      }
      router.route(event)
      .then((result) => {
        expect(result).to.equal('get')
        expect(this.testRouteGet.callCount).to.equal(1)
        expect(this.testRouteGet.calledWith(event)).to.be.true
        done()
      })
    })
    it('should map a GET route to a function with parameters', (done) => {
      let event = {
        resource: "/test",
        httpMethod: "GET",
        pathParameters: { one: 1, two: 2, three: 3 }
      }
      router.route(event)
      .then((results) => {
        expect(results).to.equal('get')
        expect(this.testRouteGet.callCount).to.equal(1)
        expect(this.testRouteGet.calledWith(event)).to.be.true
        done()
      })
    })
  })
})