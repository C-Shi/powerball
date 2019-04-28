const express = require('express')
const routes = require('./routes')
const cors = require('cors')

// Create Express App
const app = express()

// allow cors
app.use(cors())

// sample page for visualization
app.get('/sample', (req, res) => {
  res.sendFile(__dirname + '/public/sample.html')
})

// Routes
app.use('/', routes)



module.exports = app
