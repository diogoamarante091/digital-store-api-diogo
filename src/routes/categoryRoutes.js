const router = require('express').Router()
const authenticate = require('../middleware/authenticate')
const { createCategory, searchCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categoryController')

router.get('/search', searchCategories)
router.get('/:id', getCategory)
router.post('/', authenticate, createCategory)
router.put('/:id', authenticate, updateCategory)
router.delete('/:id', authenticate, deleteCategory)

module.exports = router
