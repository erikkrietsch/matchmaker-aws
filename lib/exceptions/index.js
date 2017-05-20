'use strict'

class Exception extends Error {
  constructor (code, name, message, payload) {
    super()
    this.code = code
    this.name = name
    this.payload = payload
    this.message = message

    Error.captureStackTrace(this, Exception)
  }
  apigatewayFormat () {
    return {
      statusCode: this.code,
      body: JSON.stringify({
        error: {
          code: this.code,
          type: this.name,
          message: this.message
        },
        data: this.payload
      })
    }
  }
  toString () {
    return JSON.stringify(this)
  }
}

module.exports.ExceptionError = Exception

module.exports.Exception = function (message, payload) {
  return new Exception(null, null, message, payload)
}

module.exports.ValidationException = function (message, payload) {
  return new Exception(400, 'ValidationException', message, payload)
}

module.exports.ForbiddenException = function (message, payload) {
  return new Exception(403, 'ForbiddenException', message, payload)
}

module.exports.NotFoundException = function (message, payload) {
  message = message || "Not found"
  return new Exception(404, 'NotFoundException', message, payload)
}

module.exports.ConflictException = function (message, payload) {
  return new Exception(409, 'ConflictException', message, payload)
}

module.exports.DatabaseException = function (query, error) {
  return new Exception(500, 'DatabaseException', 'cannot execute query', { query: query, error: error })
}

module.exports.EntitySaveException = function (entity, error, name) {
  return new Exception(500, 'EntitySaveException', 'error saving ' + (name || 'entity'), { entity: entity, error: error })
}

module.exports.AWSBackendException = function (message, payload) {
  return new Exception(500, 'AWSBackendException', message, payload)
}