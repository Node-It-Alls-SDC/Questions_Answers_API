var app = require('./server.js');
var request = require('supertest');
var expect = require('chai').expect;

describe('Testing API Calls', () => {

  describe('GET /', () => {
    it('should return 200 OK', () => {
      return request(app)
        .get('/')
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(200)
        .then(response => {
          expect(response.text).to.equal('This is the API for Questions and Answers\nIf you want to look at questions for a certain product\nJust go to /qa for more information or look at the documentation in the ReadMe file');
        })
    });
  });

  describe('GET /qa', () => {
    return request(app)
      .get('/qa')
      .set('Accept', 'text/html')
      .expect('Content-Type', /text/)
      .expect(200)
      .then(response => {
        expect(response.text).to.equal('To look at questions go to /questions\nTo look at answers go to /answers');
      })
  })

});