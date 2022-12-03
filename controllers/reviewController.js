const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const { checkPermissions } = require('../utils/checkPermissions')

const Review = require('../models/Review')
const Product = require('../models/Product')

const createReview = async (req, res) => {
  const { userId } = req.user
  const { product: productId } = req.body
  const product = await Product.findOne({ _id: productId })
  if (!product) {
    throw new NotFoundError(`No product with id: ${productId}`)
  }

  let review = await Review.findOne({ product: productId, user: userId })
  if (review) {
    throw new BadRequestError('Review already submitted')
  }

  req.body.user = userId
  review = await Review.create(req.body)
  return res.status(StatusCodes.CREATED).json({ review })
}

const getAllReviews = async (req, res) => {
  const reviews = await Review
    .find({})
    .populate({ path: 'product', select: 'name company price' })
    .populate({ path: 'user', select: 'name' })

  return res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new NotFoundError(`No review with id: ${reviewId}`)
  }

  return res.status(StatusCodes.OK).json({ review })
}

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new NotFoundError(`No review with id: ${reviewId}`)
  }
  checkPermissions(req.user, review.user)

  const { rating, title, comment } = req.body
  review.rating = rating
  review.title = title
  review.comment = comment

  await review.save()

  return res.status(StatusCodes.OK).json({ review })
}

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new NotFoundError(`No review with id: ${reviewId}`)
  }
  checkPermissions(req.user, review.user)

  await review.remove()

  return res.status(StatusCodes.OK).json({ msg: 'Deleted Review' })
}

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params
  const reviews = await Review.find({ product: productId })
  return res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews
}
