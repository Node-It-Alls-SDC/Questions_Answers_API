const mongoose = require('mongoose');
const {Schema} = mongoose;

mongoose.connect('mongodb://127.0.0.1:27017/Questions');

const AnswersSchema = new Schema({
  _id: Number,
  question_id: { type: Number, index: true},
  body: String,
  answerer: String,
  answerer_email: String,
  reported: Number,
  helpful: Number,
  photos: [String]
})
const QuestionsSchema = new Schema({
  _id: Number,
  product_id: { type: Number, index: true},
  body: String,
  asker_name: String,
  asker_email: String,
  reported: Number,
  helpful: Number,
  answers: {
    type: AnswersSchema,
    default: {}
  }
})

const QuestionModel = mongoose.model('Questions', QuestionsSchema);

module.exports = QuestionModel;
