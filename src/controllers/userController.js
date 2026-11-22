const bcrypt = require('bcrypt')
const User = require('../models/User')

function publicUser(user) {
  return { id: user.id, firstname: user.firstname, surname: user.surname, email: user.email }
}

async function createUser(request, response) {
  const { firstname, surname, email, password, confirmPassword } = request.body

  if (!firstname || !surname || !email || !password || password !== confirmPassword) {
    return response.status(400).json({ error: 'Dados de cadastro inválidos.' })
  }

  const existingUser = await User.findOne({ where: { email } })
  if (existingUser) return response.status(400).json({ error: 'E-mail já cadastrado.' })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ firstname, surname, email, password: passwordHash })

  return response.status(201).json(publicUser(user))
}

module.exports = { createUser }
