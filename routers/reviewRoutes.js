const express = require('express')
const { authenticateUser } = require('../middleware/authentication')

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController')

const reviewRouter = express.Router()

reviewRouter.route('/').get(getAllReviews)
reviewRouter.route('/:id').get(getSingleReview)

reviewRouter.use(authenticateUser)
reviewRouter.route('/').post(createReview)
reviewRouter.route('/:id').patch(updateReview).delete(deleteReview)

module.exports = reviewRouter
