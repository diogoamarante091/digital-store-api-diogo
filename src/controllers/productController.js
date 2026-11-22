const { sequelize, Category, Product, ProductImage, ProductOption } = require('../models')
const { Op } = require('sequelize')

const productIncludes = [
  { model: Category, as: 'categories', attributes: ['id'], through: { attributes: [] } },
  { model: ProductImage, as: 'images', attributes: ['id', 'type', 'path', 'enabled'] },
  { model: ProductOption, as: 'options' },
]

async function serializeProduct(id) {
  const product = await Product.findByPk(id, { include: productIncludes })
  if (!product) return null

  const data = product.get({ plain: true })
  return {
    ...data,
    category_ids: data.categories.map((category) => category.id),
    images: data.images.map((image) => ({ id: image.id, type: image.type, content: image.path, enabled: image.enabled })),
  }
}

async function createProduct(request, response) {
  const { enabled = false, name, slug, stock = 0, description = null, price, price_with_discount, category_ids, images = [], options = [] } = request.body
  if (!name || !slug || price === undefined || price_with_discount === undefined || !Array.isArray(category_ids) || category_ids.length === 0) {
    return response.status(400).json({ error: 'Dados do produto inválidos.' })
  }

  const categories = await Category.findAll({ where: { id: category_ids } })
  if (categories.length !== new Set(category_ids).size) return response.status(400).json({ error: 'Categoria inválida.' })
  if (await Product.findOne({ where: { slug } })) return response.status(400).json({ error: 'Slug já cadastrado.' })

  const product = await sequelize.transaction(async (transaction) => {
    const created = await Product.create({ enabled, name, slug, stock, description, price, price_with_discount }, { transaction })
    await created.setCategories(categories, { transaction })
    if (images.length) await ProductImage.bulkCreate(images.map((image) => ({ product_id: created.id, type: image.type, path: image.content, enabled: image.enabled ?? true })), { transaction })
    if (options.length) await ProductOption.bulkCreate(options.map((option) => ({ product_id: created.id, title: option.title, shape: option.shape ?? 'square', radius: option.radius ?? null, type: option.type ?? 'text', values: option.values })), { transaction })
    return created
  })

  return response.status(201).json(await serializeProduct(product.id))
}

async function getProduct(request, response) {
  const product = await serializeProduct(request.params.id)
  if (!product) return response.status(404).json({ error: 'Produto não encontrado.' })

  return response.status(200).json(product)
}

async function searchProducts(request, response) {
  const limit = Number(request.query.limit ?? 12)
  const page = Number(request.query.page ?? 1)
  if (!Number.isInteger(limit) || !Number.isInteger(page) || limit === 0 || limit < -1 || page < 1) {
    return response.status(400).json({ error: 'Paginação inválida.' })
  }

  const where = {}
  if (request.query.match) {
    where[Op.or] = [
      { name: { [Op.like]: `%${request.query.match}%` } },
      { description: { [Op.like]: `%${request.query.match}%` } },
    ]
  }

  if (request.query['price-range']) {
    const [minimum, maximum] = request.query['price-range'].split('-').map(Number)
    if (Number.isNaN(minimum) || Number.isNaN(maximum) || minimum > maximum) {
      return response.status(400).json({ error: 'Faixa de preço inválida.' })
    }
    where.price_with_discount = { [Op.between]: [minimum, maximum] }
  }

  const includes = [...productIncludes]
  if (request.query.category_ids) {
    const categoryIds = request.query.category_ids.split(',').map(Number)
    if (categoryIds.some(Number.isNaN)) return response.status(400).json({ error: 'Categorias inválidas.' })
    includes[0] = { ...includes[0], where: { id: categoryIds }, required: true }
  }

  const options = { where, include: includes, order: [['id', 'DESC']], distinct: true }
  if (limit !== -1) {
    options.limit = limit
    options.offset = (page - 1) * limit
  }

  const { count, rows } = await Product.findAndCountAll(options)
  const data = await Promise.all(rows.map((product) => serializeProduct(product.id)))
  return response.status(200).json({ data, total: count, limit, page })
}

async function updateProduct(request, response) {
  const product = await Product.findByPk(request.params.id)
  if (!product) return response.status(404).json({ error: 'Produto não encontrado.' })

  const { category_ids, images, options, ...attributes } = request.body
  if (attributes.slug) {
    const productWithSameSlug = await Product.findOne({ where: { slug: attributes.slug } })
    if (productWithSameSlug && productWithSameSlug.id !== product.id) return response.status(400).json({ error: 'Slug já cadastrado.' })
  }

  let categories = null
  if (category_ids !== undefined) {
    if (!Array.isArray(category_ids) || category_ids.length === 0) return response.status(400).json({ error: 'Categorias inválidas.' })
    categories = await Category.findAll({ where: { id: category_ids } })
    if (categories.length !== new Set(category_ids).size) return response.status(400).json({ error: 'Categorias inválidas.' })
  }
  if (images !== undefined && !Array.isArray(images)) return response.status(400).json({ error: 'Imagens inválidas.' })
  if (options !== undefined && !Array.isArray(options)) return response.status(400).json({ error: 'Opções inválidas.' })

  await sequelize.transaction(async (transaction) => {
    await product.update(attributes, { transaction })

    if (categories) {
      await product.setCategories(categories, { transaction })
    }

    if (images !== undefined) {
      await ProductImage.destroy({ where: { product_id: product.id }, transaction })
      const activeImages = images.filter((image) => !image.deleted)
      if (activeImages.length) await ProductImage.bulkCreate(activeImages.map((image) => ({ product_id: product.id, type: image.type, path: image.content, enabled: image.enabled ?? true })), { transaction })
    }

    if (options !== undefined) {
      await ProductOption.destroy({ where: { product_id: product.id }, transaction })
      const activeOptions = options.filter((option) => !option.deleted)
      if (activeOptions.length) await ProductOption.bulkCreate(activeOptions.map((option) => ({ product_id: product.id, title: option.title, shape: option.shape ?? 'square', radius: option.radius ?? null, type: option.type ?? 'text', values: option.values })), { transaction })
    }
  })

  return response.status(204).send()
}

async function deleteProduct(request, response) {
  const product = await Product.findByPk(request.params.id)
  if (!product) return response.status(404).json({ error: 'Produto não encontrado.' })

  await product.destroy()
  return response.status(204).send()
}

module.exports = { createProduct, getProduct, searchProducts, updateProduct, deleteProduct, serializeProduct }
