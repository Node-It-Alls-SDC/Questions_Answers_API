const express = require('express');
const app = express();
require('dotenv').config();
const controller = require('./controller.js');
const {transformQuestion, transformAnswer} = require('./transform.js');
app.use(express.json());

app.get('/', (req, res) => {
  res.send('This is the API for Questions and Answers\nIf you want to look at questions for a certain product\nJust go to /qa for more information or look at the documentation in the ReadMe file')
})

app.get('/qa', (req, res) => {
  res.send('To look at questions go to /questions\nTo look at answers go to /answers')
})

//GET Questions
app.get('/qa/questions', (req, res) => {
  if (!req.query.product_id) {
    return res.status(400).send('Product ID is missing');
  }
  controller.getQuestions(req.query.product_id, Number(req.query?.page), Number(req.query?.count))
    .then(result => {
      res.send({
        product_id: req.query.product_id,
        results: transformQuestion(result)
      })
    })
    .catch(err => res.status(404).send(err))
})

//GET Answers
app.get('/qa/questions/:question_id/answers', (req, res) => {
  controller.getAnswers(req.params.question_id, Number(req.query?.page), Number(req.query?.count))
    .then(result =>
      res.send({
        question: req.params.question_id,
        page: Number(req.query?.page) ? Number(req.query?.page) : 1,
        count: Number(req.query?.count) ? Number(req.query?.count) : 5,
        results: transformAnswer(result)
      })
    )
    .catch(err => res.status(404).send(err))
})

//POST Questions
app.post('/qa/questions', (req, res) => {
  if (!req.body || !req.body.body || !req.body.name || !req.body.email || !req.body.product_id) {
    return res.status(400).send('Missing one or more fields from the body');
  }
  controller.addQuestion(req.body.product_id, req.body.body, req.body.name, req.body.email)
    .then(result => res.sendStatus(201))
    .catch(err => res.status(404).send(err))
})

//POST Answers
app.post('/qa/questions/:question_id/answers', (req, res) => {
  var QuestionId = req.params.question_id;
  if (!req.body || !req.body.body || !req.body.name || !req.body.email || !req.body.photos) {
    return res.status(400).send('Missing one or more fields from the body');
  }
  controller.addAnswer(QuestionId, req.body.body, req.body.name, req.body.email, req.body.photos)
    .then(result => res.sendStatus(201))
    .catch(err => res.status(404).send(err))
})

//Increase helpfulness of Question by 1
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  var id = req.params.question_id;
  res.sendStatus(204);
})

//Mark question as reported
app.put('/qa/questions/:question_id/report', (req, res) => {
  var id = req.params.question_id;
  res.sendStatus(204);
})

//Increase helpfulness of Answer by 1
app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  var id = req.params.answer_id;
  res.sendStatus(204);
})

//Mark answer as reported
app.put('/qa/answers/:answer_id/report', (req, res) => {
  var id = req.params.answer_id;
  res.sendStatus(204);
})

app.listen(process.env.PORT, () => {
  console.log(`QA API listening on port ${process.env.PORT}`)
})