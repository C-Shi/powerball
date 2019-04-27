const axios = require('axios');
const moment = require('moment');

const ticketHelper = {
  getDraw: (date) => {
    drawDate = `${date}T00:00:00.000`;
    return axios.get('https://data.ny.gov/resource/d6yy-54nr.json', {
      params: {
        draw_date: drawDate
      }
    })
    .then(result => {
      if(result.data && result.data.length > 0) {
        let draw = result.data[0].winning_numbers;
        
      }
    })
  },

  ticketVerifier: (ticket) => {
    if (!ticket.picks || ticket.picks.length === 0) {
      throw new Error('No Pick On This Ticket');
    }
  },

  findMatch: (picks, draw) => {
    let whiteBall = 0;
    let redBall = 0;
    picks.forEach((pick, i) => {
      // last number in the array should be considered as Red ball and calculate seperately
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

  calculatePrize: (match) => {
    const white = String(match[0]);
    const red = String(match[1]);
    let prize;
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

  ticketSummary: (ticket, draw) => {
    let cash = 0;
    const summary = {
      ticket: [],
      total_winning: '',
    };
    ticket.picks.forEach((set) => {
      const match = ticketHelper.findMatch(set, draw);
      console.log(match);
      const prize = ticketHelper.calculatePrize(match);
      if(prize === 'Grand Prize') {
        summary.total_winning += 'Grand Prize + ';
      } else if (typeof prize === 'number') {
        cash += prize;
      }
      summary.ticket.push({
        prize,
        pick: set,
      })
    });

    summary.total_winning += String(cash);
    return summary;
  }
}

module.exports = ticketHelper;

// const draw = [1, 2, 3, 4, 5, 6];
// const ticket = {
//   picks: [
//     [1, 2, 3, 4, 5, 3],
//     [1, 2, 3, 12 ,5, 6],
//     [1, 2, 3, 4 ,5, 6],
//     [1, 2, 3, 4 ,5, 6],
//     [1, 2, 3, 4 ,5, 6],
//     [1, 2, 3, 4 ,5, 6]
//   ]
// }

// const sum = ticketHelper.ticketSummary(ticket, draw);
// console.log(sum);

ticketHelper.getDraw('2019-04-24')