const express = require('express')
const { root } = require('../controllers/root')
const { notFound } = require('../controllers/notfound')
const ticketHelper = require('../lib/tickerHelper');

const router = express.Router()

// Routes
router.get('/', root)

router.post('/api', (req, res) => {
  const ticket = req.body;
  const drawDate = ticket.date;

  ticketHelper.getDraw(drawDate)
  .then(draw => {
    const sum = ticketHelper.ticketSummary(ticket, draw);
    res.json(sum);
  })
  .catch(error => {
    res.status(400).json({error: error.message})
  })
})

// Fall Through Route
router.use(notFound)

module.exports = router