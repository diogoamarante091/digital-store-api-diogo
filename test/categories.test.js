const request = require('supertest')
const app = require('../src/app')
const sequelize = require('../src/config/database')

describe('POST /v1/category', () => {
  it('cria uma categoria quando recebe token válido', async () => {
    const email = `category.${Date.now()}@example.com`

    await request(app).post('/v1/user').send({
      firstname: 'Diogo', surname: 'Amarante', email, password: 'SenhaSegura#123', confirmPassword: 'SenhaSegura#123',
    })
    const login = await request(app).post('/v1/auth/login').send({ email, password: 'SenhaSegura#123' })

    const response = await request(app).post('/v1/category')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({ name: 'Tênis', slug: `tenis-${Date.now()}`, use_in_menu: true })

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({ name: 'Tênis', use_in_menu: true })
  })

  it('recusa criar categoria sem token', async () => {
    const response = await request(app).post('/v1/category').send({ name: 'Roupas', slug: 'roupas' })

    expect(response.status).toBe(401)
  })

  it('consulta, atualiza e remove uma categoria protegida', async () => {
    const email = `category-crud.${Date.now()}@example.com`
    await request(app).post('/v1/user').send({
      firstname: 'Diogo', surname: 'Amarante', email, password: 'SenhaSegura#123', confirmPassword: 'SenhaSegura#123',
    })
    const login = await request(app).post('/v1/auth/login').send({ email, password: 'SenhaSegura#123' })
    const token = login.body.token
    const created = await request(app).post('/v1/category').set('Authorization', `Bearer ${token}`)
      .send({ name: 'Roupas', slug: `roupas-${Date.now()}` })

    const found = await request(app).get(`/v1/category/${created.body.id}`)
    expect(found.status).toBe(200)
    expect(found.body.name).toBe('Roupas')

    const updated = await request(app).put(`/v1/category/${created.body.id}`).set('Authorization', `Bearer ${token}`)
      .send({ name: 'Vestuário', slug: `vestuario-${Date.now()}`, use_in_menu: true })
    expect(updated.status).toBe(204)

    const deleted = await request(app).delete(`/v1/category/${created.body.id}`).set('Authorization', `Bearer ${token}`)
    expect(deleted.status).toBe(204)
  })
})

afterAll(async () => {
  await sequelize.close()
})
