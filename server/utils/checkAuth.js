const { AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const { SECRET_KEY } = require('../config')
const users = require('../graphql/resolvers/users')

module.exports = context => {
  // context = { ... headers }
  const authHeader = context.req.headers.authorization

  if (authHeader) {
    // authHeader is in the form of "Bearer ..."
    const token = authHeader.split('Bearer ')[1]
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY)
        return user
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token given')
      }
    }
    throw new Error(
      "Authentication token must be in the form of 'Bearer [token]'"
    )
  }
  throw new Error('Authorization header must be provided')
}
