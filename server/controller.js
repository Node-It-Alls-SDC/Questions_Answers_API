const Models = require('./db.js');

module.exports = {
  getQuestions: (product_id, page, count) => {
    page = page ? page : 1;
    count = count ? count : 5;
    return Models.Questions.findAll({offset: ((page - 1) * count), limit: count, attributes: {exclude: ['asker_email', 'product_id']}, where: {product_id, reported: false}, include: [{model: Models.Answers, as: 'answers', attributes: {include: [['answer_id', 'id']], exclude:['answer_id', 'reported', 'answerer_email', 'question_id']}, where: {reported: false}, required: false, include: [{model: Models.Photos, as: 'photos', attributes:{exclude:['answer_id']}, required: false}]}], order: [['question_helpfulness', 'DESC'], [{model: Models.Answers, as: 'answers'}, 'helpfulness', 'DESC']]
    })
  },
  getAnswers: (question_id, page, count) => {
    return Models.Answers.findAll({
      offset: ((page - 1) * count), limit: count, attributes: {exclude: ['answerer_email', 'question_id', 'reported']},where: {question_id, reported: false}, include: [{model: Models.Photos, as: 'photos', attributes:{exclude:['answer_id']}, required: false}], order: [['helpfulness', 'DESC']]
    })
  },
  addQuestion: (product_id, question_body, asker_name, asker_email) => {
    return Models.Questions.create({product_id, question_body, asker_name, asker_email})
  },
  addAnswer: (question_id, body, answerer_name, answerer_email, photos) => {
    return Models.Answers.create({question_id, body, answerer_name, answerer_email, photos}, {include: [{model: Models.Photos, as: 'photos'}]})
  },
  helpfulQuestion: (question_id) => {
    return Models.Questions.increment({question_helpfulness: 1}, {where: {question_id}});
  },
  reportQuestion: (question_id) => {
    return Models.Questions.update({reported: true}, {where: {question_id}});
  },
  helpfulAnswer: (answer_id) => {
    return Models.Answers.increment({helpfulness: 1}, {where: {answer_id}});
  },
  reportAnswer: (answer_id) => {
    return Models.Answers.update({reported: true}, {where: {answer_id}});
  }
}