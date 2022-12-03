const express = require('express')
const { authenticateUser, authorizePermissions } = require('../middleware/authentication')

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage
} = require('../controllers/productController')

const {
  getSingleProductReviews
} = require('../controllers/reviewController')

const productRouter = express.Router()

productRouter.route('/').get(getAllProducts)
productRouter.route('/:id').get(getSingleProduct)
productRouter.route('/:id/reviews').get(getSingleProductReviews)

productRouter.use(authenticateUser)
productRouter.use(authorizePermissions('admin'))
productRouter.route('/').post(createProduct)
productRouter.route('/uploadImage').post(uploadImage)
productRouter.route('/:id').patch(updateProduct).delete(deleteProduct)

module.exports = productRouter
