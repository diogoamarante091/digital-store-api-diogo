const router = require('express').Router()
const authenticate = require('../middleware/authenticate')
const { createProduct, getProduct, searchProducts, updateProduct, deleteProduct } = require('../controllers/productController')

router.get('/search', searchProducts)
router.get('/:id', getProduct)
router.post('/', authenticate, createProduct)
router.put('/:id', authenticate, updateProduct)
router.delete('/:id', authenticate, deleteProduct)

module.exports = router
