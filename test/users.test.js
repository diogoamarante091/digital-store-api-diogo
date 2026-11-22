const request = require('supertest')
const app = require('../src/app')
const sequelize = require('../src/config/database')

describe('POST /v1/user', () => {
  it('cadastra um usuário sem devolver a senha', async () => {
    const response = await request(app).post('/v1/user').send({
      firstname: 'Diogo',
      surname: 'Amarante',
      email: `diogo.${Date.now()}@example.com`,
      password: 'SenhaSegura#123',
      confirmPassword: 'SenhaSegura#123',
    })

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({ firstname: 'Diogo', surname: 'Amarante' })
    expect(response.body.password).toBeUndefined()
  })
})

afterAll(async () => {
  await sequelize.close()
})
