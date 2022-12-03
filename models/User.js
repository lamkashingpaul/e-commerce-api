const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minLength: 3,
    maxLength: 50
  },

  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email'
    }
  },

  password: {
    type: String,
    required: [true, 'Please provide password'],
    minLength: 6
  },

  role: {
    type: String,
    required: [true, 'Please provide role'],
    enum: {
      values: ['admin', 'user'],
      message: ''
    },
    default: 'user'
  }

}, { timestamps: true })

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10))
  }
})

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)
