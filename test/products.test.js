const request = require('supertest')
const app = require('../src/app')
const sequelize = require('../src/config/database')

describe('POST /v1/product', () => {
  it('cria um produto com categoria, imagem e opções', async () => {
    const email = `product.${Date.now()}@example.com`
    await request(app).post('/v1/user').send({
      firstname: 'Diogo', surname: 'Amarante', email, password: 'SenhaSegura#123', confirmPassword: 'SenhaSegura#123',
    })
    const login = await request(app).post('/v1/auth/login').send({ email, password: 'SenhaSegura#123' })
    const token = login.body.token
    const category = await request(app).post('/v1/category').set('Authorization', `Bearer ${token}`)
      .send({ name: 'Tênis', slug: `tenis-produto-${Date.now()}`, use_in_menu: true })

    const response = await request(app).post('/v1/product').set('Authorization', `Bearer ${token}`).send({
      enabled: true,
      name: 'Tênis React',
      slug: `tenis-react-${Date.now()}`,
      stock: 10,
      description: 'Produto de teste',
      price: 199.9,
      price_with_discount: 149.9,
      category_ids: [category.body.id],
      images: [{ type: 'image/png', content: 'imagem-base64-de-teste' }],
      options: [{ title: 'Tamanho', shape: 'square', type: 'text', values: ['39', '40'] }],
    })

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({ name: 'Tênis React', category_ids: [category.body.id] })
    expect(response.body.images).toHaveLength(1)
    expect(response.body.options).toHaveLength(1)

    const detail = await request(app).get(`/v1/product/${response.body.id}`)
    expect(detail.status).toBe(200)
    expect(detail.body.name).toBe('Tênis React')

    const search = await request(app).get('/v1/product/search?match=React')
    expect(search.status).toBe(200)
    expect(search.body.data.some((product) => product.id === response.body.id)).toBe(true)

    const updated = await request(app).put(`/v1/product/${response.body.id}`).set('Authorization', `Bearer ${token}`).send({
      name: 'Tênis React Atualizado', stock: 12, price: 209.9, price_with_discount: 159.9,
    })
    expect(updated.status).toBe(204)

    const deleted = await request(app).delete(`/v1/product/${response.body.id}`).set('Authorization', `Bearer ${token}`)
    expect(deleted.status).toBe(204)
  })
})

afterAll(async () => {
  await sequelize.close()
})
