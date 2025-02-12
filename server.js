const express = require('express')
const app = express()
require('dotenv').config()

app.use(express.json());

app.get('/', (req, res) => {
  res.send('This is the API for Questions and Answers\nIf you want to look at questions for a certain product\nJust go to /qa for more information or look at the documentation in the ReadMe file')
})

app.get('/qa', (req, res) => {
  res.send('To look at questions go to /questions\nTo look at answers go to /answers')
})

//GET Questions
app.get('/qa/questions', (req, res) => {
  var ProductId = req.query.product_id
  if (!ProductId) {
    return res.status(400).send('Product ID is missing');
  }
  res.send('Success!');
})

//GET Answers
app.get('/qa/questions/:question_id/answers', (req, res) => {
  var QuestionId = req.params.question_id;
  console.log(QuestionId)
  res.send('Success!');
})

//POST Questions
app.post('/qa/questions', (req, res) => {
  var ProductId = req.query.product_id
  if (!ProductId) {
    return res.status(400).send('Product ID is missing');
  }
  if (!req.body || !req.body.body || !req.body.name || !req.body.email) {
    return res.status(400).send('Missing one or more fields from the body');
  }
  res.sendStatus(201);
})

//POST Answers
app.post('/qa/questions/:question_id/answers', (req, res) => {
  var QuestionId = req.params.question_id;
  if (!req.body || !req.body.body || !req.body.name || !req.body.email) {
    return res.status(400).send('Missing one or more fields from the body');
  }
  res.sendStatus(201);
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