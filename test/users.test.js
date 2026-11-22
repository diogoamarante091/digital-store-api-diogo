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

  it('consulta, atualiza e exclui o próprio cadastro com token', async () => {
    const email = `user-crud.${Date.now()}@example.com`
    const created = await request(app).post('/v1/user').send({
      firstname: 'Diogo', surname: 'Amarante', email, password: 'SenhaSegura#123', confirmPassword: 'SenhaSegura#123',
    })
    const login = await request(app).post('/v1/auth/login').send({ email, password: 'SenhaSegura#123' })
    const token = login.body.token

    const found = await request(app).get(`/v1/user/${created.body.id}`)
    expect(found.status).toBe(200)
    expect(found.body.email).toBe(email)

    const updated = await request(app).put(`/v1/user/${created.body.id}`).set('Authorization', `Bearer ${token}`)
      .send({ firstname: 'Diogo', surname: 'A.', email })
    expect(updated.status).toBe(204)

    const deleted = await request(app).delete(`/v1/user/${created.body.id}`).set('Authorization', `Bearer ${token}`)
    expect(deleted.status).toBe(204)
  })
})

afterAll(async () => {
  await sequelize.close()
})
