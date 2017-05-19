'use strict'

var Promise = require('bluebird')

var routes = require('./routes.js')
var exceptions = require('../exceptions')

/* Event schema:
{
    "resource": "/players",
    "path": "/players",
    "httpMethod": "GET",
    "headers": {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*//*;q=0.8",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "en-us",
        "CloudFront-Forwarded-Proto": "https",
        "CloudFront-Is-Desktop-Viewer": "true",
        "CloudFront-Is-Mobile-Viewer": "false",
        "CloudFront-Is-SmartTV-Viewer": "false",
        "CloudFront-Is-Tablet-Viewer": "false",
        "CloudFront-Viewer-Country": "US",
        "dnt": "1",
        "Host": "dsct5glrsh.execute-api.us-east-1.amazonaws.com",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/604.1.22 (KHTML, like Gecko) Version/10.2 Safari/604.1.22",
        "Via": "2.0 eae4c9b28979fa6e912511e042cf823c.cloudfront.net (CloudFront)",
        "X-Amz-Cf-Id": "LYhUD7XY2gBhLMMAqPVmx0SaMU72C7450XufSAgeuj_4rlZiKtIU1Q==",
        "X-Amzn-Trace-Id": "Root=1-591efc7e-2fe253e3604b995f355938d7",
        "X-Forwarded-For": "24.14.249.109, 54.182.238.9",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
    },
    "queryStringParameters": null,
    "pathParameters": null,
    "stageVariables": null,
    "requestContext": {
        "path": "/dev/players",
        "accountId": "<accountId>",
        "resourceId": "61vnwg",
        "stage": "dev",
        "requestId": "b63571bc-3c9c-11e7-86e6-75071e0ed0b2",
        "identity": {
            "cognitoIdentityPoolId": null,
            "accountId": null,
            "cognitoIdentityId": null,
            "caller": null,
            "apiKey": "",
            "sourceIp": "24.14.249.109",
            "accessKey": null,
            "cognitoAuthenticationType": null,
            "cognitoAuthenticationProvider": null,
            "userArn": null,
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/604.1.22 (KHTML, like Gecko) Version/10.2 Safari/604.1.22",
            "user": null
        },
        "resourcePath": "/players",
        "httpMethod": "GET",
        "apiId": "dsct5glrsh"
    },
    "body": null,
    "isBase64Encoded": false
}
*/
module.exports.route = (event) => {
  console.log(event)
  let route = (routes[event.resource] || []).filter((entry) => entry.method == event.httpMethod)[0]
  if (!route) return Promise.reject(new exceptions.NotFoundException('Not found'))
  return route.func(event)
}