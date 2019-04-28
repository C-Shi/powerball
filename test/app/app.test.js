const app = require('../../app/app')
const request = require('supertest')

test('App Environment', () => {
  expect(app.settings.env).toEqual('test')
})

test('App Base Path', () => {
  expect(app.mountpath).toEqual('/')
})

test('Should Arrive Sample Page', (done) => {
  request(app).get('/sample')
  .expect(/<h4>Sample Ticket on 2019-04-24<\/h4>/)
  .expect(200, done)
})

describe('Post Data To API route', () => {
  test('Should Return Error If Given Invalid Date On Ticket', done => {
    request(app).post('/api')
    .set('Content-Type', 'application/json')
    .send({
      'date': '2011-15-123',
      'picks' : [
        [1, 2, 3, 4, 5, 6]
      ]
    })
    .expect(400)
    .end((err, res) => {
      if(err) done(err)
      expect(res.body.error).toEqual('Invalid Date. Accepted Date format is YYYY-MM-DD')
      done()
    })
  })

  test('Should Return Object contains correct prize info when posting JSON', done => {
    request(app).post('/api')
    .set('Content-type', 'application/json')
    .send({
      date: '2019-04-24',
      picks: [
        [6, 32, 35, 36, 65, 4]
      ]
    })
    .expect(200)
    .end((err, res) => {
      if (err) done(err)
      expect(res.body.totalWinning).toEqual('Grand Prize + 0')
      done()
    })
  })

  test('Should Return object contains correct prize info when post from HTML form', done => {
    request(app).post('/api')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      date: '2019-04-24',
      picks: [
        [6, 32, 35, 36, 65, 4],
        [8, 32, 35, 36, 65, 10]
      ]
    })
    .expect(200)
    .end((err, res) => {
      if (err) done(err)
      expect(res.body.totalWinning).toEqual('Grand Prize + 100')
      done()
    })
  })
})
