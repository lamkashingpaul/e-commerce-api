const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utils')

const User = require('../models/User')

const register = async (req, res) => {
  const { name, email, password } = req.body

  if (await User.findOne({ email })) {
    throw new BadRequestError('Email has been used, please provide another one.')
  }

  let role = 'user'
  if (!await User.countDocuments({})) {
    role = 'admin'
  }

  const user = await User.create({ name, email, password, role })
  const tokenUser = createTokenUser(user)

  attachCookiesToResponse({ res, user: tokenUser })
  return res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  const user = await User.findOne({ email })
  if (!user || !await user.comparePassword(password)) {
    throw new UnauthenticatedError('No matches found in database')
  }

  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })

  return res.status(StatusCodes.OK).json({ user: tokenUser })
}

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now())
  })
  return res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}

module.exports = {
  register,
  login,
  logout
}
