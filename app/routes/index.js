const express = require('express')
const { root } = require('../controllers/root')
const { notFound } = require('../controllers/notfound')
const ticketHelper = require('../lib/tickethelper')

const router = express.Router()

// Routes
router.get('/', root)

router.get('/api', (req, res) => {
  const ticket = req.query
  const drawDate = ticket.date
  
  // verify that ticket submit is correct with format and does not missing any information
  const ticketVerified = ticketHelper.ticketVerifier(ticket)
  if (!ticketVerified.result) {
    return res.status(400).json({ 'error': ticketVerified.message })
  }

  // calling public API to aquire draw info
  ticketHelper.getDraw(drawDate)
  .then(draw => {
    // calling function to format response, which will call subsequented method as needed
    const sum = ticketHelper.ticketSummary(ticket, draw)
    return res.json(sum)
  })
  .catch(error => {
    res.status(400).json({error: error.message})
  })
})

// Fall Through Route
router.use(notFound)

module.exports = router