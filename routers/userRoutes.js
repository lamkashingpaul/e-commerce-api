const express = require('express')

const { authenticateUser, authorizePermissions } = require('../middleware/authentication')

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword
} = require('../controllers/userController')

const userRouter = express.Router()

userRouter.use(authenticateUser)

userRouter.route('/').get(authorizePermissions('admin'), getAllUsers)

userRouter.route('/showMe').get(showCurrentUser)
userRouter.route('/updateUser').patch(updateUser)
userRouter.route('/updateUserPassword').patch(updateUserPassword)

userRouter.route('/:id').get(getSingleUser)

module.exports = userRouter
