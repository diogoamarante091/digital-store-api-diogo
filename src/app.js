const express = require('express')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/v1/user', userRoutes)
app.use('/v1/auth', authRoutes)
app.use('/v1/category', categoryRoutes)
app.use('/v1/product', productRoutes)

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok' })
})

module.exports = app
