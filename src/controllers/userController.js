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

async function getUser(request, response) {
  const user = await User.findByPk(request.params.id)
  if (!user) return response.status(404).json({ error: 'Usuário não encontrado.' })

  return response.status(200).json(publicUser(user))
}

async function updateUser(request, response) {
  const user = await User.findByPk(request.params.id)
  if (!user) return response.status(404).json({ error: 'Usuário não encontrado.' })
  if (Number(request.user.sub) !== user.id) return response.status(403).json({ error: 'Sem permissão para alterar este usuário.' })

  const { firstname, surname, email } = request.body
  if (!firstname || !surname || !email) return response.status(400).json({ error: 'Nome, sobrenome e e-mail são obrigatórios.' })

  const userWithSameEmail = await User.findOne({ where: { email } })
  if (userWithSameEmail && userWithSameEmail.id !== user.id) return response.status(400).json({ error: 'E-mail já cadastrado.' })

  await user.update({ firstname, surname, email })
  return response.status(204).send()
}

async function deleteUser(request, response) {
  const user = await User.findByPk(request.params.id)
  if (!user) return response.status(404).json({ error: 'Usuário não encontrado.' })
  if (Number(request.user.sub) !== user.id) return response.status(403).json({ error: 'Sem permissão para excluir este usuário.' })

  await user.destroy()
  return response.status(204).send()
}

module.exports = { createUser, getUser, updateUser, deleteUser }
