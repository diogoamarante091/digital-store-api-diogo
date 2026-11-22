const request = require('supertest')
const app = require('../src/app')
const sequelize = require('../src/config/database')

describe('POST /v1/auth/login', () => {
  it('autentica um usuário cadastrado e devolve um token JWT', async () => {
    const email = `login.${Date.now()}@example.com`

    await request(app).post('/v1/user').send({
      firstname: 'Diogo',
      surname: 'Amarante',
      email,
      password: 'SenhaSegura#123',
      confirmPassword: 'SenhaSegura#123',
    })

    const response = await request(app).post('/v1/auth/login').send({ email, password: 'SenhaSegura#123' })

    expect(response.status).toBe(200)
    expect(response.body.token).toEqual(expect.any(String))
  })
})

afterAll(async () => {
  await sequelize.close()
})
