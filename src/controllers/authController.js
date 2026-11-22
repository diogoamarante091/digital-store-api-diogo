const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function login(request, response) {
  const { email, password } = request.body

  if (!email || !password) return response.status(400).json({ error: 'E-mail e senha são obrigatórios.' })

  const user = await User.findOne({ where: { email } })
  const passwordMatches = user && await bcrypt.compare(password, user.password)

  if (!passwordMatches) return response.status(401).json({ error: 'E-mail ou senha inválidos.' })

  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })

  return response.status(200).json({ token })
}

module.exports = { login }
