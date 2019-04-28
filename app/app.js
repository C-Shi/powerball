const express = require('express')
const routes = require('./routes')
const bodyParser = require('body-parser')
const cors = require('cors')

// Create Express App
const app = express()

// allow cors
app.use(cors())

// Config Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


// sample page for visualization
app.get('/sample', (req, res) => {
  res.sendFile(__dirname + '/public/sample.html')
})

// Routes
app.use('/', routes)



module.exports = app
