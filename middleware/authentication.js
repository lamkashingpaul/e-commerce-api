const { UnauthenticatedError, UnauthorizedError } = require('../errors')
const { isTokenValid } = require('../utils')

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token

  try {
    const payload = isTokenValid({ token })
    const { name, userId, role } = payload
    req.user = { name, userId, role }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Invalid Credential')
  }
}

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized to access this route')
    }
    next()
  }
}

module.exports = {
  authenticateUser,
  authorizePermissions
}
