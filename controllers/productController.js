const path = require('path')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const Product = require('../models/Product')

const createProduct = async (req, res) => {
  req.body.user = req.user.userId
  const product = await Product.create(req.body)
  return res.status(StatusCodes.CREATED).json({ product })
}

const getAllProducts = async (req, res) => {
  const products = await Product.find({})
  return res.status(StatusCodes.OK).json({ products })
}

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findOne({ _id: productId }).populate('reviews')
  if (!product) {
    throw new NotFoundError(`No product with id: ${productId}`)
  }

  return res.status(StatusCodes.OK).json({ product })
}

const updateProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, { new: true, runValidators: true })
  if (!product) {
    throw new NotFoundError(`No product with id: ${productId}`)
  }

  return res.status(StatusCodes.OK).json({ product })
}

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findOne({ _id: productId })
  if (!product) {
    throw new NotFoundError(`No product with id: ${productId}`)
  }

  await product.remove()

  return res.status(StatusCodes.OK).json({ msg: 'Product Deleted' })
}

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError('No File Uploaded')
  }

  const productImage = req.files.image
  if (!productImage || !productImage.mimetype.startsWith('image')) {
    throw new BadRequestError('Please Upload Image')
  }

  const maxSize = 1024 * 1024
  if (productImage.size > maxSize) {
    throw new BadRequestError('Please upload image smaller than 1MB')
  }

  await productImage.mv(path.resolve(__dirname, `../public/uploads/${productImage.name}`))

  return res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` })
}

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage
}
