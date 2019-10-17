require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
const helmet = require('helmet')
const cors = require('cors')
const app = express()
const MOVIEDEX = require('./moviedex.json')

app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  
  if(!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})

app.get('/movie', function handleGetMovie(req, res) {
  let response = MOVIEDEX

  // filter by genre
  if(req.query.genre) {
    response = response.filter(movie =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())  
    )
  }

  // filter by country
  if(req.query.country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())  
    )
  }

  // filter by average vote
  if(req.query.avg_vote) {
    response = response.filter(movie =>
      Number(movie.avg_vote) >= Number(req.query.avg_vote)
    )
  }

  res.json(response)
})

app.use((error, req, res, next) => {
  let response
  if(process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})