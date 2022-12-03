const mongoose = require('mongoose')

const SingleOrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
})

const OrderSchema = new mongoose.Schema({
  tax: {
    type: Number,
    required: [true, 'Please provide tax'],
    default: 0
  },

  shippingFee: {
    type: Number,
    required: [true, 'Please provide shipping fee'],
    default: 0
  },

  subtotal: {
    type: Number,
    require: [true, 'Please provide subtotal'],
    default: 0
  },

  total: {
    type: Number,
    required: [true, 'Please provide total'],
    default: 0
  },

  orderItems: {
    type: [SingleOrderItemSchema],
    required: [true, 'Please provide Order items']
  },

  status: {
    type: String,
    enum: {
      values: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
      message: '{VALUE} is not supported'
    },
    default: 'pending'
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user']
  },

  clientSecret: {
    type: String,
    required: [true, 'Please provide client secret']
  },

  paymentId: {
    type: String
  }

}, { timestamps: true })

module.exports = mongoose.model('Order', OrderSchema)
