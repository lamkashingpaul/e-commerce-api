const jwt = require('jsonwebtoken')

const createJWT = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

const isTokenValid = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

const attachCookiesToResponse = ({ res, user }) => {
  res.cookie('token', createJWT({ payload: user }), {
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    httpOnly: true,
    expires: new Date(Date.now() + 86400000) // one day
  })
}

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse
}
