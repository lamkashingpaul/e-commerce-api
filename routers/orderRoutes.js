const express = require('express')

const { authenticateUser, authorizePermissions } = require('../middleware/authentication')

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder
} = require('../controllers/orderController')

const orderRouter = express.Router()

orderRouter.use(authenticateUser)

orderRouter.route('/').get(authorizePermissions('admin'), getAllOrders).post(createOrder)
orderRouter.route('/showAllMyOrders').get(getCurrentUserOrders)
orderRouter.route('/:id').get(getSingleOrder).patch(updateOrder)

module.exports = orderRouter
