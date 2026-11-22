const swaggerJsdoc = require('swagger-jsdoc')

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Digital Store API',
      version: '1.0.0',
      description: 'API REST do projeto final de Back-end.',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        UserInput: { type: 'object', required: ['firstname', 'surname', 'email', 'password', 'confirmPassword'], properties: { firstname: { type: 'string' }, surname: { type: 'string' }, email: { type: 'string', format: 'email' }, password: { type: 'string' }, confirmPassword: { type: 'string' } } },
        CategoryInput: { type: 'object', required: ['name', 'slug'], properties: { name: { type: 'string' }, slug: { type: 'string' }, use_in_menu: { type: 'boolean' } } },
        ProductInput: { type: 'object', required: ['name', 'slug', 'price', 'price_with_discount', 'category_ids'], properties: { name: { type: 'string' }, slug: { type: 'string' }, price: { type: 'number' }, price_with_discount: { type: 'number' }, category_ids: { type: 'array', items: { type: 'integer' } } } },
      },
    },
    paths: {
      '/health': { get: { summary: 'Verifica se a API está disponível', responses: { 200: { description: 'API disponível' } } } },
      '/v1/user': { post: { summary: 'Cadastra usuário', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UserInput' } } } }, responses: { 201: { description: 'Usuário criado' }, 400: { description: 'Dados inválidos' } } } },
      '/v1/user/{id}': {
        get: { summary: 'Consulta usuário por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Usuário encontrado' }, 404: { description: 'Não encontrado' } } },
        put: { summary: 'Atualiza o próprio usuário', security: [{ bearerAuth: [] }], responses: { 204: { description: 'Atualizado' } } },
        delete: { summary: 'Exclui o próprio usuário', security: [{ bearerAuth: [] }], responses: { 204: { description: 'Excluído' } } },
      },
      '/v1/auth/login': { post: { summary: 'Autentica e retorna JWT', responses: { 200: { description: 'Token gerado' }, 401: { description: 'Credenciais inválidas' } } } },
      '/v1/category/search': { get: { summary: 'Lista categorias', responses: { 200: { description: 'Categorias encontradas' } } } },
      '/v1/category': { post: { summary: 'Cria categoria', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryInput' } } } }, responses: { 201: { description: 'Categoria criada' } } } },
      '/v1/category/{id}': { get: { summary: 'Consulta categoria', responses: { 200: { description: 'Categoria encontrada' } } }, put: { summary: 'Atualiza categoria', security: [{ bearerAuth: [] }], responses: { 204: { description: 'Atualizada' } } }, delete: { summary: 'Exclui categoria', security: [{ bearerAuth: [] }], responses: { 204: { description: 'Excluída' } } } },
      '/v1/product/search': { get: { summary: 'Busca produtos com filtros e paginação', responses: { 200: { description: 'Produtos encontrados' } } } },
      '/v1/product': { post: { summary: 'Cria produto', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductInput' } } } }, responses: { 201: { description: 'Produto criado' } } } },
      '/v1/product/{id}': { get: { summary: 'Consulta produto', responses: { 200: { description: 'Produto encontrado' } } }, put: { summary: 'Atualiza produto', security: [{ bearerAuth: [] }], responses: { 204: { description: 'Atualizado' } } }, delete: { summary: 'Exclui produto', security: [{ bearerAuth: [] }], responses: { 204: { description: 'Excluído' } } } },
    },
  },
  apis: [],
})
