const createTokenUser = (user) => {
  const { name, _id: userId, role } = user
  return { name, userId, role }
}

module.exports = { createTokenUser }
