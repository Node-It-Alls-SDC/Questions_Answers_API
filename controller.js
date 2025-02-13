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
  },
  addQuestion: (ProductId, body, asker_name, asker_email) => {
    return Models.Questions.create({ProductId, body, asker_name, asker_email})
  },
  addAnswer: (QuestionId, body, answerer_name, answerer_email, photos) => {
    return Models.Answers.create({QuestionId, body, answerer_name, answerer_email})
      .then((res) => {
        var raw = JSON.parse(JSON.stringify(res));
        if (photos.length > 0) {
          var inserted = photos.map(photo => {
            return {
              url: photo,
              AnswerId: raw.id
            }
          })
          return Models.Photos.bulkCreate(inserted);
        } else {
          return new Promise((resolve, reject) => resolve());
        }
      })
  }
}