const Models = require('./db.js');

module.exports = {
  getQuestions: (ProductId, page, count) => {
    page = page ? page : 1;
    count = count ? count : 5;
    return Models.Questions.findAll({offset: ((page - 1) * count), limit: count, where: {ProductId, reported: false}, include: [{model: Models.Answers, where: {reported: false}, include: [Models.Photos]}], order: [['helpful', 'DESC'], [{model: Models.Answers}, 'helpful', 'DESC']]
    })
  },
  getAnswers: (QuestionId, page, count) => {
    page = page ? page : 1;
    count = count ? count : 5;
    return Models.Answers.findAll({
      offset: ((page - 1) * count), limit: count, where: {QuestionId, reported: false}, include: [Models.Photos], order: [['helpful', 'DESC']]
    })
  }
}