const express = require('express')
const app = express()
require('dotenv').config()

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
  res.send('Success!');
})

//GET Answers
app.get('/qa/questions/:question_id/answers', (req, res) => {
  res.send('Success!');
})

//POST Questions
app.post('/qa/questions', (req, res) => {
  if (!req.query.product_id) {
    return res.status(400).send('Product ID is missing');
  }
  res.sendStatus(201);
})

//POST Answers
app.post('/qa/questions/:question_id/answers', (req, res) => {
  res.sendStatus(201);
})

app.listen(process.env.PORT, () => {
  console.log(`QA API listening on port ${process.env.PORT}`)
})