const { AuthenticationError, UserInputError } = require('apollo-server')

const Post = require('../../models/Post')
const User = require('../../models/User')
const checkAuth = require('../../utils/checkAuth')

module.exports = {
  Query: {
    async getPosts() {
      // use try to prevent server from crashing due to query failure
      try {
        const posts = await Post.find().sort({ createdAt: -1 })
        return posts
      } catch (err) {
        throw new Error(err)
      }
    },

    async getPost(_, { postID }) {
      try {
        const post = await Post.findById(postID)

        if (post) {
          return post
        } else {
          throw new Error('Post not found')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
  },

  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context)

      if (body.trim() === '') {
        throw new UserInputError('Post body must not be empty')
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      })

      const post = await newPost.save()

      context.pubsub.publish('NEW_POST', {
          newPost: post
      })
      
      return post
    },

    async deletePost(_, { postID }, context) {
      const user = checkAuth(context)

      try {
        const post = await Post.findById(postID)
        if (post.username === user.username) {
          await post.delete()
          return `Post ${postID} deleted successfully`
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } catch (err) {
        throw new Error(err)
      }
    },

    async likePost(_, { postID }, context) {
      const { username } = checkAuth(context)
      const post = await Post.findById(postID)

      if (post) {
        // Check if already liked, if so unlike
        if (post.likes.find(like => like.username === username)) {
          post.likes = post.likes.filter(like => like.username !== username)
          // else it is not liked, like it
        } else {
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          })
        }

        await post.save()
        return post
      } else {
        throw new UserInputError('Post not found')
      }
    },
  },

  Subscription: {
      newPost: {
          subscribe: (_, __, {pubsub}) => pubsub.asyncIterator('NEW_POST')
      }
  }
}
