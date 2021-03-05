const express = require('express')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const jwtAuthz = require('express-jwt-authz')

const app = express()

// Define middleware that validates incoming bearer tokens
// using JWKS from YOUR_DOMAIN

const authConfig = require("./auth_config.json")

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"]
})

const checkScope = jwtAuthz(
  [
    'read:users'
  ],
  {
    customScopeKey: 'permissions'
  }
)

app.get('/api/v2/external', checkJwt, (req, res) => {
  res.send({
    msg: "Your Access Token was successfully validated!"
  })
})

app.get('/api/v2/external_permission', checkJwt, checkScope, (req, res) => {
  res.send({
    msg: "Your Access Token was successfully validated! (Included Permission)"
  })
})

app.listen(5000, () => console.log('API listening on 5000'))
