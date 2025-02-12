const QuestionModel = require('./db.js');
const {questionStream} = require('./extract.js');

const questions = questionStream();
questions.then(result => QuestionModel.insertMany(result).then(function () {
  console.log("Data inserted") // Success
}).catch(function (error) {
  console.log(error)     // Failure
}) )