const app = require('./app')
const sequelize = require('./config/database')

const port = Number(process.env.PORT || 3000)

async function startServer() {
  try {
    await sequelize.authenticate()
    app.listen(port, () => console.log(`API disponível em http://localhost:${port}`))
  } catch (error) {
    console.error('Não foi possível conectar ao MySQL:', error.message)
    process.exit(1)
  }
}

startServer()
