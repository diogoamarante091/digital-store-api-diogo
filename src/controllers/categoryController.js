const Category = require('../models/Category')

async function createCategory(request, response) {
  const { name, slug, use_in_menu = false } = request.body
  if (!name || !slug) return response.status(400).json({ error: 'Nome e slug são obrigatórios.' })

  const existingCategory = await Category.findOne({ where: { slug } })
  if (existingCategory) return response.status(400).json({ error: 'Slug já cadastrado.' })

  const category = await Category.create({ name, slug, use_in_menu })
  return response.status(201).json(category)
}

async function searchCategories(request, response) {
  const limit = Number(request.query.limit ?? 12)
  const page = Number(request.query.page ?? 1)
  if (!Number.isInteger(limit) || !Number.isInteger(page) || limit === 0 || limit < -1 || page < 1) {
    return response.status(400).json({ error: 'Paginação inválida.' })
  }

  const where = {}
  if (request.query.use_in_menu !== undefined) where.use_in_menu = request.query.use_in_menu === 'true'

  const options = { where, order: [['name', 'ASC']] }
  if (limit !== -1) {
    options.limit = limit
    options.offset = (page - 1) * limit
  }

  const { count, rows } = await Category.findAndCountAll(options)
  return response.status(200).json({ data: rows, total: count, limit, page })
}

async function getCategory(request, response) {
  const category = await Category.findByPk(request.params.id)
  if (!category) return response.status(404).json({ error: 'Categoria não encontrada.' })

  return response.status(200).json(category)
}

async function updateCategory(request, response) {
  const category = await Category.findByPk(request.params.id)
  if (!category) return response.status(404).json({ error: 'Categoria não encontrada.' })

  const { name, slug, use_in_menu } = request.body
  if (!name || !slug) return response.status(400).json({ error: 'Nome e slug são obrigatórios.' })

  const categoryWithSameSlug = await Category.findOne({ where: { slug } })
  if (categoryWithSameSlug && categoryWithSameSlug.id !== category.id) {
    return response.status(400).json({ error: 'Slug já cadastrado.' })
  }

  await category.update({ name, slug, use_in_menu: Boolean(use_in_menu) })
  return response.status(204).send()
}

async function deleteCategory(request, response) {
  const category = await Category.findByPk(request.params.id)
  if (!category) return response.status(404).json({ error: 'Categoria não encontrada.' })

  await category.destroy()
  return response.status(204).send()
}

module.exports = { createCategory, searchCategories, getCategory, updateCategory, deleteCategory }
