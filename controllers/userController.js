const { NotFoundError, BadRequestError, UnauthenticatedError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../utils')
const User = require('../models/User')

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password')
  return res.status(StatusCodes.OK).json({ users })
}

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params

  const user = await User.findOne({ _id: userId }, { password: 0 })
  if (!user) {
    throw new NotFoundError(`No user with id: ${userId}`)
  }

  checkPermissions(req.user, user._id)

  return res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
  const { user } = req
  return res.status(StatusCodes.OK).json({ user })
}

// update user with user.save()
const updateUser = async (req, res) => {
  const { name, email } = req.body
  if (!name || !email) {
    throw new BadRequestError('Please provide `name` and `email`')
  }

  const { userId } = req.user
  const user = await User.findOne({ _id: userId })

  user.name = name
  user.email = email
  await user.save()

  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })

  return res.status(StatusCodes.OK).json({ user: tokenUser })
}

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    throw new BadRequestError('Please provide `oldPassword` and `newPassword`')
  }

  const user = await User.findOne({ _id: req.user.userId })
  if (!user || !await user.comparePassword(oldPassword)) {
    throw new UnauthenticatedError('Invalid credential')
  }

  user.password = newPassword
  await user.save()

  return res.status(StatusCodes.OK).json({ msg: 'Updated User Password' })
}

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword
}

// update user with User.findOneAndUpdate
// const updateUser = async (req, res) => {
//   const { name, email } = req.body
//   if (!name || !email) {
//     throw new BadRequestError('Please provide `name` and `email`')
//   }

//   const { userId } = req.user
//   const user = await User.findOneAndUpdate({ _id: userId }, { name, email }, { new: true, runValidators: true })

//   const tokenUser = createTokenUser(user)
//   attachCookiesToResponse({ res, user: tokenUser })

//   return res.status(StatusCodes.OK).json({ user: tokenUser })
// }
