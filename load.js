const QuestionModel = require('./db.js');
const {questionStream} = require('./extract.js');

questionStream(QuestionModel);
