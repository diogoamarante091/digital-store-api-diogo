const jwt = require('jsonwebtoken')

function authenticate(request, response, next) {
  const authorization = request.headers.authorization
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null

  if (!token) return response.status(401).json({ error: 'Token de autorização obrigatório.' })

  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET)
    return next()
  } catch {
    return response.status(401).json({ error: 'Token de autorização inválido.' })
  }
}

module.exports = authenticate
