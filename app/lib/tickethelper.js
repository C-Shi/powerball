const axios = require('axios')
const moment = require('moment')

const ticketHelper = {
  // method for getting draw data from public API
  getDraw: (date) => {
    let drawDate = `${date}T00:00:00.000`
    // sending ajax request to public API to get the draw info
    return axios.get('https://data.ny.gov/resource/d6yy-54nr.json', {
      params: {
        draw_date: drawDate
      }
    })
    .then(result => {
      // verify that the date you request does have a draw
      if(result.data && result.data.length > 0) {
        let draw = result.data[0].winning_numbers
        // converting string type winning_number into array with number for futher calculation
        draw = draw.split(' ')
        draw = draw.map(number => Number(number))
        return draw
      } else {
        throw new Error('Unable to find draw info. Please verify that the day you request do have a draw')
      }
    })
  },

  // method for finding match number for a pick set
  findMatch: (picks, draw) => {
    let whiteBall = 0
    let redBall = 0
    picks.forEach((pick, i) => {
      // last number in the array should be considered as Red ball and calculate seperately
      pick = Number(pick)
      if (i !== 5) {
        // count white abll
        if(draw.indexOf(pick) !== 5 && draw.indexOf(pick) !== -1) {
          whiteBall++
        }
      } else {
        // count red ball
        if(draw.indexOf(pick) === 5) {
          redBall++
        }
      }
    })
    // function returns array of the number of match in white and red ball;
    return [whiteBall, redBall]
  },

  // method for calculate winning amount of a pick set
  calculatePrize: (match) => {
    const white = String(match[0])
    const red = String(match[1])
    let prize
    
    // A switch-case to find out what is the winning price for this pick
    switch(`${white} ${red}`) {
      case '5 1':
        prize = 'Grand Prize'
        break
      case '5 0':
        prize = 1000000
        break
      case '4 1':
        prize = 50000
        break
      case '4 0':
        prize = 100
        break
      case '3 1':
        prize = 100
        break
      case '3 0':
        prize = 7
        break
      case '2 1':
        prize = 7
        break
      case '1 1':
        prize = 4
        break
      case '0 1':
        prize = 4
        break
      default:
        prize = false 
    }
    return prize
  },

  ticketVerifier: (ticket) => {
    const picks = ticket.picks
    const verification = {
      result: true,
      message: ""
    }
    const drawDate = ticket.date
    // verify if request draw date format correct
    if (!drawDate || !moment(drawDate).isValid()) {
      verification.result = false
      verification.message = 'Invalid Date. Accepted Date format is YYYY-MM-DD'
      return verification
    }

    // verify if ticket has a picks property
    if (!picks) {
      verification.result = false
      verification.message = "Missing Ticket Propery Picks"
      return verification
    }

    // verify if the ticket picks is array type
    if (!Array.isArray(picks)) {
      verification.result = false
      verification.message = 'Invalid Data Type. Picks should be array'
      return verification
    }

    // verifying each pick
    for(let i = 0; i < picks.length; i++) {
      // verify if each pick is array
      if (!Array.isArray(picks[i])) {
        verification.result = false
        verification.message = 'Invalid Data Type. Picks should be array'
        break
      // verify if each pick contains 6 elements
      } else if (picks[i].length !== 6) {
        verification.result = false
        verification.message = "Invalid Pick. Each pick should contains 6 Number"
        break
      }

      picks[i].forEach((pick, j, arr) => {
        // verify if only number submited as pick info
        if (typeof pick !== 'number' && Number.isNaN(Number(pick))) {
          verification.result = false
          verification.message = "Pick should only contains number"
          return 
        }

        // seperate regular ball with powerball
        // Not last element indicate that this is a regular ball
        if(arr[j + 1]) {
          // verify white ball range
          if (pick > 69 || pick < 1) {
            verification.result = false
            verification.message = "Each Regular ball should between 1 and 69"
          }
        // verify powerball range
        } else {
          if (pick > 26 || pick < 1) {
            verification.result = false
            verification.message = "Invalid Pick. Powerball should between 1 and 26"
          }
        }
      })
    }
    return verification
  },

  // root method for calculating all info on ticket
  // this is the root method and will call subsequent method as needed
  ticketSummary: (ticket, draw) => {
    // construct the structure for return object
    let cash = 0
    const summary = {
      ticket: [],
      totalWinning: '',
    }

    // calling method for each pick set to find the winning amount
    ticket.picks.forEach((set) => {
      // calling method to check match and prize for each pick
      const match = ticketHelper.findMatch(set, draw)
      const prize = ticketHelper.calculatePrize(match)

      // construct summary info for total winning prize
      if(prize === 'Grand Prize') {
        summary.totalWinning += 'Grand Prize + '
      } else if (typeof prize === 'number') {
        cash += prize
      }

      // construct detail info of winning for each pick
      summary.ticket.push({
        prize,
        pick: set,
      })
    })

    summary.totalWinning += String(cash)
    return summary
  }
}

module.exports = ticketHelper
