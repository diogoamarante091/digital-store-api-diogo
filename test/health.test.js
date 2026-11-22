const request = require('supertest')
const app = require('../src/app')

describe('GET /health', () => {
  it('informa que a API está disponível', async () => {
    const response = await request(app).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'ok' })
  })
})
