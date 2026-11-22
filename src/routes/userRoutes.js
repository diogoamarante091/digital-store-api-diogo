const router = require('express').Router()
const authenticate = require('../middleware/authenticate')
const { createUser, getUser, updateUser, deleteUser } = require('../controllers/userController')

router.post('/', createUser)
router.get('/:id', getUser)
router.put('/:id', authenticate, updateUser)
router.delete('/:id', authenticate, deleteUser)

module.exports = router
