const axios = require('axios');
const moment = require('moment');

const ticketHelper = {
  // method for getting draw data from public API
  getDraw: (date) => {
    drawDate = `${date}T00:00:00.000`;
    // verify if request draw date format correct
    if (!moment(drawDate).isValid()) {
      return new Promise((resolve, reject) => {
        reject(new Error('Invalid Date Format. You should submit date as YYYY-MM-DD'));
      })
    }

    // sending ajax request to public API to get the draw info
    return axios.get('https://data.ny.gov/resource/d6yy-54nr.json', {
      params: {
        draw_date: drawDate
      }
    })
    .then(result => {
      // verify that the date you request does have a draw
      if(result.data && result.data.length > 0) {
        let draw = result.data[0].winning_numbers;
        // converting string type winning_number into array with number for futher calculation
        draw = draw.split(' ');
        draw = draw.map(number => Number(number));
        return draw;
      } else {
        throw new Error('Unable to find draw info. Please verify that the day you request do have a draw');
      }
    })
  },

  // method for finding match number for a pick set
  findMatch: (picks, draw) => {
    let whiteBall = 0;
    let redBall = 0;
    picks.forEach((pick, i) => {
      // last number in the array should be considered as Red ball and calculate seperately
      pick = Number(pick);
      if (i !== 5) {
        // count white abll
        if(draw.indexOf(pick) !== 5 & draw.indexOf(pick) !== -1) {
          whiteBall++;
        }
      } else {
        // count red ball
        if(draw.indexOf(pick) === 5) {
          redBall++;
        }
      }
    })
    // function returns array of the number of match in white and red ball;
    return [whiteBall, redBall];
  },

  // method for calculate winning amount of a pick set
  calculatePrize: (match) => {
    const white = String(match[0]);
    const red = String(match[1]);
    let prize;
    
    // A switch-case to find out what is the winning price for this pick
    switch(`${white} ${red}`) {
      case '5 1':
        prize = 'Grand Prize';
        break;
      case '5 0':
        prize = 1000000;
        break;
      case '4 1':
        prize = 50000;
        break;
      case '4 0':
        prize = 100;
        break;
      case '3 1':
        prize = 100;
        break;
      case '3 0':
        prize = 7;
        break;
      case '2 1':
        prize = 7;
        break;
      case '1 1':
        prize = 4;
        break;
      case '0 1':
        prize = 4;
        break;
      default:
        prize = false; 
    }
    return prize;
  },

  // root method for calculating all info on ticket
  // this is the root method and will call subsequent method as needed
  ticketSummary: (ticket, draw) => {
    // construct the structure for return object
    let cash = 0;
    const summary = {
      ticket: [],
      totalWinning: '',
    };

    // calling method for each pick set to find the winning amount
    ticket.picks.forEach((set) => {
      const match = ticketHelper.findMatch(set, draw);
      const prize = ticketHelper.calculatePrize(match);
      if(prize === 'Grand Prize') {
        summary.totalWinning += 'Grand Prize + ';
      } else if (typeof prize === 'number') {
        cash += prize;
      }
      summary.ticket.push({
        prize,
        pick: set,
      })
    });

    summary.totalWinning += String(cash);
    return summary;
  }
}

module.exports = ticketHelper;
