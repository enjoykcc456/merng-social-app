const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../utils/validators')
const { generateToken } = require('../../utils/common')
const { SECRET_KEY } = require('../../config')
const User = require('../../models/User')

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      // Check if the username or password is empty
      const { errors, valid } = validateLoginInput(username, password)
      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }

      // Check if user is valid
      const user = await User.findOne({ username })
      if (!user) {
        errors.general = 'User not found'
        throw new UserInputError('User not found', { errors })
      }

      // If user is valid, check if input password match
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        errors.general = 'Wrong Credential'
        throw new UserInputError('Wrong credential', { errors })
      }

      const token = generateToken(user)

      return {
        ...user._doc,
        id: user._id,
        token,
      }
    },

    async register(
      _,
      { registerInput: { username, password, confirmPassword, email } }
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        password,
        confirmPassword,
        email
      )
      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }

      // Make sure user doesnt already exist
      const user = await User.findOne({ username })
      if (user) {
        throw new UserInputError('Username already exists', {
          errors: {
            username: 'This username is taken',
          },
        })
      }

      // Hash password and create an auth token
      try {
        password = await bcrypt.hash(password, 12)

        const newUser = new User({
          username,
          password,
          email,
          createdAt: new Date().toISOString(),
        })

        const res = await newUser.save()

        const token = generateToken(res)

        return {
          ...res._doc,
          id: res._id,
          token,
        }
      } catch (err) {
        console.log('err', err)
        throw new Error(err)
      }
    },
  },
}
