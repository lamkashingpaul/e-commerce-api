const { UnauthorizedError } = require('../errors')

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role !== 'admin' && requestUser.userId !== resourceUserId.toString()) {
    throw new UnauthorizedError('Not authorized to access this route')
  }
}

module.exports = { checkPermissions }
