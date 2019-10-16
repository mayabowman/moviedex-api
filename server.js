require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()

console.log(process.env.API_TOKEN)

app.use(morgan('dev'))

app.use(function validateBearerToken(req, res, next) {
  console.log('validate bearer token middleware')
  // move to the next middleware
  next()
})

app.get('/movie', handleGetMovie)

function handleGetMovie(req, res) {
  res.send('Hello, Hollywood!')
}

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})