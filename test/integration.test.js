var app = require('../server/server.js');
var request = require('supertest');
var expect = require('chai').expect;

describe('QA API Integration Tests', () => {

  describe('Creating Questions and Answers', () => {
    it('Should be able to get back the question that we created', () => {
      var question = {
        body: 'This is a integration test',
        name: 'Supertest',
        email: 'supertest@supertest.com',
        product_id: '903488'
      }
      return request(app)
        .post('/qa/questions')
        .send(question)
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(201)
        .then(() => {
          return request(app)
            .get('/qa/questions?product_id=903488&count=9999999')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              expect(response.body.results[response.body.results.length - 1].question_body).to.equal('This is a integration test');
              expect(response.body.results[response.body.results.length - 1].asker_name).to.equal('Supertest');
              expect(response.body.results[response.body.results.length - 1].question_helpfulness).to.equal(0);
            })
        })
    })

    it('Should be able to get back the answer that we created', () => {
      var answer = {
        body: 'This is a integration test',
        name: 'Supertest',
        email: 'supertest@supertest.com',
        photos: ['supertest.png']
      }
      return request(app)
        .post('/qa/questions/903488/answers')
        .send(answer)
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(201)
        .then(() => {
          return request(app)
            .get('/qa/questions/903488/answers?count=9999999')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              expect(response.body.results[response.body.results.length - 1].body).to.equal('This is a integration test');
              expect(response.body.results[response.body.results.length - 1].answerer_name).to.equal('Supertest');
              expect(response.body.results[response.body.results.length - 1].helpfulness).to.equal(0);
            })
        })
    })
  })

  describe('Reporting Questions and Answers', () => {
    it('Reported questions should not show up in GET requests', () => {
        var question = {
          body: 'This is a integration test',
          name: 'Supertest',
          email: 'supertest@supertest.com',
          product_id: '876543'
        }
        return request(app)
          .post('/qa/questions')
          .send(question)
          .set('Accept', 'text/html')
          .expect('Content-Type', /text/)
          .expect(201)
          .then(() => {
            return request(app)
              .get('/qa/questions?product_id=903488&count=9999999')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(200)
              .then((response) => {
                var id = response.body.results[response.body.results.length - 1].question_id
                return request(app)
                  .put(`/qa/questions/${id}/report`)
                  .expect(204)
                  .then(() => {
                    return request(app)
                      .get('/qa/questions?product_id=903488&count=9999999')
                      .set('Accept', 'application/json')
                      .expect('Content-Type', /json/)
                      .expect(200)
                      .then((response) => {
                        expect(response.body.results[response.body.results.length - 1].question_id).not.equal(id)
                      })
                  })
              })
          })
    })

    it('Reported answers should not show up in GET requests', () => {
      var answer = {
        body: 'This is a integration test',
        name: 'Supertest',
        email: 'supertest@supertest.com',
        photos: []
      }
      return request(app)
        .post('/qa/questions/876543/answers')
        .send(answer)
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(201)
        .then(() => {
          return request(app)
            .get('/qa/questions/876543/answers?count=9999999')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              var id = response.body.results[response.body.results.length - 1].answer_id
              return request(app)
                .put(`/qa/answers/${id}/report`)
                .expect(204)
                .then(() => {
                  return request(app)
                    .get('/qa/questions/876543/answers?count=9999999')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then((response) => {
                      expect(response.body.results[response.body.results.length - 1].answer_id).not.equal(id)
                    })
                })
            })
        })
    })
  })

  describe('Marking Questions and Answers as Helpful', () => {
    it('Should increase helpfulness of question by 1', () => {
      return request(app)
        .get('/qa/questions?product_id=457642&count=9999999')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          var helpful = response.body.results[0].question_helpfulness;
          return request(app)
            .put(`/qa/questions/${response.body.results[0].question_id}/helpful`)
            .expect(204)
            .then(() => {
              return request(app)
              .get('/qa/questions?product_id=457642&count=9999999')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(200)
              .then((response) => {
                expect(response.body.results[0].question_helpfulness).to.equal(helpful + 1)
              })
            })
        })
    })

    it('Should increase helpfulness of answer by 1', () => {
      return request(app)
        .get('/qa/questions/457642/answers?count=9999999')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          var helpful = response.body.results[0].helpfulness;
          return request(app)
            .put(`/qa/answers/${response.body.results[0].answer_id}/helpful`)
            .expect(204)
            .then(() => {
              return request(app)
              .get('/qa/questions/457642/answers?count=9999999')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(200)
              .then((response) => {
                expect(response.body.results[0].helpfulness).to.equal(helpful + 1)
              })
            })
        })
    })
  })
})