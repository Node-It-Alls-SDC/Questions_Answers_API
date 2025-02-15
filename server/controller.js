const Models = require('./db.js');

module.exports = {
  getQuestions: (ProductId, page, count) => {
    page = page ? page : 1;
    count = count ? count : 5;
    return Models.Questions.findAll({offset: ((page - 1) * count), limit: count, where: {ProductId, reported: false}, include: [{model: Models.Answers, where: {reported: false}, required: false, include: [{model: Models.Photos, required: false}]}], order: [['helpful', 'DESC'], [{model: Models.Answers}, 'helpful', 'DESC']]
    })
  },
  getAnswers: (QuestionId, page, count) => {
    page = page ? page : 1;
    count = count ? count : 5;
    return Models.Answers.findAll({
      offset: ((page - 1) * count), limit: count, where: {QuestionId, reported: false}, include: [{model: Models.Photos, required: false}], order: [['helpful', 'DESC']]
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
  },
  helpfulQuestion: (id) => {
    return Models.Questions.increment({helpful: 1}, {where: {id}});
  },
  reportQuestion: (id) => {
    return Models.Questions.update({reported: true}, {where: {id}});
  },
  helpfulAnswer: (id) => {
    return Models.Answers.increment({helpful: 1}, {where: {id}});
  },
  reportAnswer: (id) => {
    return Models.Answers.update({reported: true}, {where: {id}});
  }
}