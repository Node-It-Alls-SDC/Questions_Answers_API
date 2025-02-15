const express = require('express');
const app = express();
require('dotenv').config();
const controller = require('./controller.js');
const {transformQuestion, transformAnswer} = require('./utils/transform.js');
app.use(express.json());

app.get('/', (req, res) => {
  res.send('This is the API for Questions and Answers\nIf you want to look at questions for a certain product\nJust go to /qa for more information or look at the documentation in the ReadMe file')
})

app.get('/qa', (req, res) => {
  res.send('To look at questions go to /qa/questions?product_id=?\nTo look at answers go to /qa/questions/:question_id/answers')
})

//GET Questions
app.get('/qa/questions', (req, res) => {
  if (!req.query.product_id) {
    return res.status(400).send('ProductId is missing');
  }
  if (isNaN(Number(req.query.product_id)) || Number(req.query.product_id) <= 0 || Number(req.query.product_id) > 4294967295) {
    return res.status(404).send('Invalid ProductId')
  }
  controller.getQuestions(req.query.product_id, Number(req.query?.page), Number(req.query?.count))
    .then(result => {
      res.send({
        product_id: Number(req.query.product_id),
        results: transformQuestion(result)
      })
    })
    .catch(err => res.status(500).send(err))
})

//GET Answers
app.get('/qa/questions/:question_id/answers', (req, res) => {
  if (isNaN(Number(req.params.question_id)) || req.params.question_id <= 0 || req.params.question_id > 4294967295) {
    return res.status(404).send('Invalid QuestionId')
  }
  controller.getAnswers(req.params.question_id, Number(req.query?.page), Number(req.query?.count))
    .then(result =>
      res.send({
        question: Number(req.params.question_id),
        page: Number(req.query?.page) ? Number(req.query?.page) : 1,
        count: Number(req.query?.count) ? Number(req.query?.count) : 5,
        results: transformAnswer(result)
      })
    )
    .catch(err => res.status(500).send(err))
})

//POST Questions
app.post('/qa/questions', (req, res) => {
  if (!req.body.product_id) {
    return res.status(400).send('ProductId is missing');
  }
  if (isNaN(Number(req.body.product_id)) || req.body.product_id <= 0 || req.body.product_id > 4294967295) {
    return res.status(404).send('Invalid ProductId')
  }
  if (!req.body || !req.body.body || !req.body.name || !req.body.email) {
    return res.status(400).send('Missing one or more fields from the body');
  }
  if (typeof req.body.body !== 'string' || typeof req.body.email !== 'string' || typeof req.body.name !== 'string') {
    return res.status(404).send('Invalid Form');
  }
  controller.addQuestion(req.body.product_id, req.body.body, req.body.name, req.body.email)
    .then(() => res.sendStatus(201))
    .catch(err => res.status(500).send(err))
})

//POST Answers
app.post('/qa/questions/:question_id/answers', (req, res) => {
  if (isNaN(Number(req.params.question_id)) || req.params.question_id <= 0 || req.params.question_id > 4294967295) {
    return res.status(404).send('Invalid QuestionId');
  }
  if (!req.body || !req.body.body || !req.body.name || !req.body.email || !req.body.photos) {
    return res.status(400).send('Missing one or more fields from the body');
  }
  if (typeof req.body.body !== 'string' || typeof req.body.email !== 'string' || typeof req.body.name !== 'string' || !Array.isArray(req.body.photos)) {
    return res.status(404).send('Invalid Form');
  }
  controller.addAnswer(req.params.question_id, req.body.body, req.body.name, req.body.email, req.body.photos)
    .then(() => res.sendStatus(201))
    .catch(err => res.status(500).send(err))
})

//Increase helpfulness of Question by 1
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  if (isNaN(Number(req.params.question_id)) || req.params.question_id <= 0 || req.params.question_id > 4294967295) {
    return res.status(404).send('Invalid QuestionId')
  }
  controller.helpfulQuestion(req.params.question_id)
    .then(() => res.sendStatus(204))
    .catch(err => res.status(500).send(err))
})

//Mark question as reported
app.put('/qa/questions/:question_id/report', (req, res) => {
  if (isNaN(Number(req.params.question_id)) || req.params.question_id <= 0 || req.params.question_id > 4294967295) {
    return res.status(404).send('Invalid QuestionId')
  }
  controller.reportQuestion(req.params.question_id)
    .then(() => res.sendStatus(204))
    .catch(err => res.status(500).send(err))
})

//Increase helpfulness of Answer by 1
app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  if (isNaN(Number(req.params.answer_id)) || req.params.answer_id <= 0 || req.params.answer_id > 4294967295) {
    return res.status(404).send('Invalid AnswerId')
  }
  controller.helpfulAnswer(req.params.answer_id)
    .then(() => res.sendStatus(204))
    .catch(err => res.status(500).send(err))
})

//Mark answer as reported
app.put('/qa/answers/:answer_id/report', (req, res) => {
  if (isNaN(Number(req.params.answer_id)) || req.params.answer_id <= 0 || req.params.answer_id > 4294967295) {
    return res.status(404).send('Invalid AnswerId')
  }
  controller.reportAnswer(req.params.answer_id)
    .then(() => res.sendStatus(204))
    .catch(err => res.status(500).send(err))
})

module.exports = app.listen(process.env.PORT, () => {
  console.log(`QA API listening on port ${process.env.PORT}`)
})

