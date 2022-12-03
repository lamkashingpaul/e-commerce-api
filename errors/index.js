const CustomAPIError = require('./custom-api')
const UnauthorizedError = require('./unauthorized')
const UnauthenticatedError = require('./unauthenticated')
const NotFoundError = require('./not-found')
const BadRequestError = require('./bad-request')

module.exports = {
  CustomAPIError,
  UnauthorizedError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError
}
