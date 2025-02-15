var app = require('./server.js');
var request = require('supertest');
var expect = require('chai').expect;

describe('QA API Unit Tests', () => {

  describe('GET /', () => {
    it('should return 200 OK and text to direct you in the right direction', () => {
      return request(app)
        .get('/')
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(200)
        .then(response => {
          expect(response.text).to.equal('This is the API for Questions and Answers\nIf you want to look at questions for a certain product\nJust go to /qa for more information or look at the documentation in the ReadMe file');
        });
    });
  });

  describe('GET /qa', () => {
    it('should return 200 OK and text to direct you in the right direction', () => {
      return request(app)
        .get('/qa')
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(200)
        .then(response => {
          expect(response.text).to.equal('To look at questions go to /qa/questions?product_id=?\nTo look at answers go to /qa/questions/:question_id/answers');
        });
    });
  });

  describe('GET /qa/questions', () => {
    it('Should return 200 OK and get all the questions at product id 1 and they should be formatted correctly', () => {
      return request(app)
        .get('/qa/questions?product_id=1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.product_id).to.equal(1);
          expect(response.body.results.length).to.equal(5);
          expect(response.body.results[0].question_id).to.be.a('number');
          expect(response.body.results[0].question_body).to.be.a('string');
          expect(!isNaN(Date.parse(response.body.results[0].question_date))).to.be.true;
          expect(response.body.results[0].asker_name).to.be.a('string');
          expect(response.body.results[0].question_helpfulness).to.be.a('number');
          expect(response.body.results[0].reported).to.be.false;
          expect(response.body.results[0].answers).to.be.a('object');
          expect(response.body.results[1].answers[Object.keys(response.body.results[1].answers)[Object.keys(response.body.results[1].answers).length - 1]].id).to.equal(Number(Object.keys(response.body.results[1].answers)[Object.keys(response.body.results[1].answers).length - 1]))
          expect(response.body.results[1].answers[Object.keys(response.body.results[1].answers)[Object.keys(response.body.results[1].answers).length - 1]].body).to.be.a('string');
          expect(!isNaN(Date.parse(response.body.results[1].answers[Object.keys(response.body.results[1].answers)[Object.keys(response.body.results[1].answers).length - 1]].date))).to.be.true;
          expect(response.body.results[1].answers[Object.keys(response.body.results[1].answers)[Object.keys(response.body.results[1].answers).length - 1]].answerer_name).to.be.a('string');
          expect(response.body.results[1].answers[Object.keys(response.body.results[1].answers)[Object.keys(response.body.results[1].answers).length - 1]].helpfulness).to.be.a('number');
          expect(response.body.results[1].answers[Object.keys(response.body.results[1].answers)[Object.keys(response.body.results[1].answers).length - 1]].photos).to.be.a('array');
          expect(response.body.results[1].answers[Object.keys(response.body.results[1].answers)[Object.keys(response.body.results[1].answers).length - 1]].photos[1].id).to.be.a('number');
          expect(response.body.results[1].answers[Object.keys(response.body.results[1].answers)[Object.keys(response.body.results[1].answers).length - 1]].photos[1].url).to.be.a('string');
        })
    });

    it('Should throw an error if given invalid product id', () => {
      return request(app)
        .get('/qa/questions?product_id=0')
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(404)
        .then((err) => {
          expect(err.text).to.equal('Invalid ProductId');
          return request(app)
            .get('/qa/questions?product_id=4294967296')
            .set('Accept', 'text/html')
            .expect('Content-Type', /text/)
            .expect(404)
            .then((err) => {
              expect(err.text).to.equal('Invalid ProductId');
              return request(app)
                .get('/qa/questions?product_id=fhasfhdsj')
                .set('Accept', 'text/html')
                .expect('Content-Type', /text/)
                .expect(404)
                .then((err) => {
                  expect(err.text).to.equal('Invalid ProductId')
                })
            })
        })
    });

    it('Should throw an error if given no product id', () => {
      return request(app)
        .get('/qa/questions')
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(400)
        .then((err) => {
          expect(err.text).to.equal('ProductId is missing');
        })
    });
  });

  describe('GET /qa/questions/:question_id/answers', () => {

    it('Should return 200 OK and get all the answers at question id 1 and they should be formatted correctly', () => {
      return request(app)
        .get('/qa/questions/1/answers')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.question).to.equal(1);
          expect(response.body.page).to.equal(1);
          expect(response.body.count).to.equal(5);
          expect(response.body.results.length).to.equal(5);
          expect(response.body.results[0].answer_id).to.be.a('number');
          expect(response.body.results[0].body).to.be.a('string');
          expect(!isNaN(Date.parse(response.body.results[0].date))).to.be.true;
          expect(response.body.results[0].answerer_name).to.be.a('string');
          expect(response.body.results[0].helpfulness).to.be.a('number');
          expect(response.body.results[0].photos).to.be.a('array');
          expect(response.body.results[3].photos[0].id).to.be.a('number');
          expect(response.body.results[3].photos[0].url).to.be.a('string');
        })
    });

    it('Should throw an error if given invalid question id', () => {
      return request(app)
        .get('/qa/questions/0/answers')
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(404)
        .then((err) => {
          expect(err.text).to.equal('Invalid QuestionId');
          return request(app)
            .get('/qa/questions/4294967296/answers')
            .set('Accept', 'text/html')
            .expect('Content-Type', /text/)
            .expect(404)
            .then((err) => {
              expect(err.text).to.equal('Invalid QuestionId');
              return request(app)
                .get('/qa/questions/dfsdfjdj/answers')
                .set('Accept', 'text/html')
                .expect('Content-Type', /text/)
                .expect(404)
                .then((err) => {
                  expect(err.text).to.equal('Invalid QuestionId')
                })
            })
        })
    });

  });

  describe('POST /qa/questions', () => {

    it('Should return 201 Created and create a question if given valid fields', () => {
      var question = {
        body: 'This is a supertest',
        name: 'Supertest',
        email: 'supertest@supertest.com',
        product_id: '10'
      }
      return request(app)
        .post('/qa/questions')
        .send(question)
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(201)
    })

    it('Should throw an error if missing fields', () => {
      var question = {
        name: 'Invalid',
        product_id: '3'
      }
      return request(app)
        .post('/qa/questions')
        .send(question)
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(400)
        .then(err => expect(err.text).to.equal('Missing one or more fields from the body'))
    })

    it('Should throw an error if given invalid product id', () => {
      return request(app)
        .post('/qa/questions')
        .send({product_id: '0'})
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(404)
        .then((err) => {
          expect(err.text).to.equal('Invalid ProductId');
          return request(app)
            .post('/qa/questions')
            .send({product_id: '4294967296'})
            .set('Accept', 'text/html')
            .expect('Content-Type', /text/)
            .expect(404)
            .then((err) => {
              expect(err.text).to.equal('Invalid ProductId');
              return request(app)
                .post('/qa/questions')
                .send({product_id: 'fhasfhdsj'})
                .set('Accept', 'text/html')
                .expect('Content-Type', /text/)
                .expect(404)
                .then((err) => {
                  expect(err.text).to.equal('Invalid ProductId')
                })
            })
        })
    });

    it('should throw an error for any invalid data types for the rest of the fields', () => {
      var question = {
        body: {},
        name: [],
        email: 453535,
        product_id: '10'
      }
      return request(app)
        .post('/qa/questions')
        .send(question)
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(404)
    })
  })

  describe('POST /qa/questions/:question_id/answers', () => {

    it('Should return 201 Created and create an answer if given valid fields', () => {
      var answer = {
        body: 'This is a supertest',
        name: 'Supertest',
        email: 'supertest@supertest.com',
        photos: []
      }
      return request(app)
        .post('/qa/questions/10/answers')
        .send(answer)
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(201)
    })

    it('Should throw an error if missing fields', () => {
      var answer = {
        name: 'Invalid'
      }
      return request(app)
        .post('/qa/questions/1/answers')
        .send(answer)
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(400)
        .then(err => expect(err.text).to.equal('Missing one or more fields from the body'))
    })

    it('Should throw an error if given invalid question id', () => {
      return request(app)
        .post('/qa/questions/0/answers')
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(404)
        .then((err) => {
          expect(err.text).to.equal('Invalid QuestionId');
          return request(app)
            .post('/qa/questions/4294967296/answers')
            .set('Accept', 'text/html')
            .expect('Content-Type', /text/)
            .expect(404)
            .then((err) => {
              expect(err.text).to.equal('Invalid QuestionId');
              return request(app)
                .post('/qa/questions/fhasfhdsj/answers')
                .set('Accept', 'text/html')
                .expect('Content-Type', /text/)
                .expect(404)
                .then((err) => {
                  expect(err.text).to.equal('Invalid QuestionId')
                })
            })
        })
    });

    it('should throw an error for any invalid data types for the rest of the fields', () => {
      var answer = {
        body: {},
        name: [],
        email: 453535,
        photos: 123453
      }
      return request(app)
        .post('/qa/questions/1/answers')
        .send(answer)
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(404)
    })
  })

  describe('PUT /qa/questions/:question_id/helpful', () => {

    it('Should return 204 No Content and mark a question as helpful', () => {
      return request(app)
        .put('/qa/questions/1156/helpful')
        .expect(204)
    })

    it('Should throw an error if given invalid question id', () => {
      return request(app)
        .put('/qa/questions/0/helpful')
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(404)
        .then((err) => {
          expect(err.text).to.equal('Invalid QuestionId');
          return request(app)
            .put('/qa/questions/4294967296/helpful')
            .set('Accept', 'text/html')
            .expect('Content-Type', /text/)
            .expect(404)
            .then((err) => {
              expect(err.text).to.equal('Invalid QuestionId');
              return request(app)
                .put('/qa/questions/fhasfhdsj/helpful')
                .set('Accept', 'text/html')
                .expect('Content-Type', /text/)
                .expect(404)
                .then((err) => {
                  expect(err.text).to.equal('Invalid QuestionId')
                })
            })
        })
    });
  })

  describe('PUT /qa/questions/:question_id/report', () => {

    it('Should return 204 No Content and mark a question as reported', () => {
      return request(app)
        .put('/qa/questions/124/report')
        .expect(204)
    })

    it('Should throw an error if given invalid question id', () => {
      return request(app)
        .put('/qa/questions/0/report')
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(404)
        .then((err) => {
          expect(err.text).to.equal('Invalid QuestionId');
          return request(app)
            .put('/qa/questions/4294967296/report')
            .set('Accept', 'text/html')
            .expect('Content-Type', /text/)
            .expect(404)
            .then((err) => {
              expect(err.text).to.equal('Invalid QuestionId');
              return request(app)
                .put('/qa/questions/fhasfhdsj/report')
                .set('Accept', 'text/html')
                .expect('Content-Type', /text/)
                .expect(404)
                .then((err) => {
                  expect(err.text).to.equal('Invalid QuestionId')
                })
            })
        })
    });
  })

  describe('PUT /qa/answers/:answer_id/helpful', () => {

    it('Should return 204 No Content and mark an answer as helpful', () => {
      return request(app)
        .put('/qa/answers/56/helpful')
        .expect(204)
    })

    it('Should throw an error if given invalid answer id', () => {
      return request(app)
        .put('/qa/answers/0/helpful')
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(404)
        .then((err) => {
          expect(err.text).to.equal('Invalid AnswerId');
          return request(app)
            .put('/qa/answers/4294967296/helpful')
            .set('Accept', 'text/html')
            .expect('Content-Type', /text/)
            .expect(404)
            .then((err) => {
              expect(err.text).to.equal('Invalid AnswerId');
              return request(app)
                .put('/qa/answers/fhasfhdsj/helpful')
                .set('Accept', 'text/html')
                .expect('Content-Type', /text/)
                .expect(404)
                .then((err) => {
                  expect(err.text).to.equal('Invalid AnswerId')
                })
            })
        })
    });
  })

  describe('PUT /qa/answers/:answer_id/report', () => {

    it('Should return 204 No Content and mark an answer as reported', () => {
      return request(app)
        .put('/qa/answers/74/report')
        .expect(204)
    })

    it('Should throw an error if given invalid answer id', () => {
      return request(app)
        .put('/qa/answers/0/report')
        .set('Accept', 'text/html')
        .expect('Content-Type', /text/)
        .expect(404)
        .then((err) => {
          expect(err.text).to.equal('Invalid AnswerId');
          return request(app)
            .put('/qa/answers/4294967296/report')
            .set('Accept', 'text/html')
            .expect('Content-Type', /text/)
            .expect(404)
            .then((err) => {
              expect(err.text).to.equal('Invalid AnswerId');
              return request(app)
                .put('/qa/answers/fhasfhdsj/report')
                .set('Accept', 'text/html')
                .expect('Content-Type', /text/)
                .expect(404)
                .then((err) => {
                  expect(err.text).to.equal('Invalid AnswerId')
                })
            })
        })
    });
  })

});