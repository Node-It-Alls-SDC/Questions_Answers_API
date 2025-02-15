const Models = require('./db.js');

module.exports = {
  getQuestions: (product_id, page, count) => {
    page = page ? page : 1;
    count = count ? count : 5;
    return Models.Questions.findAll({offset: ((page - 1) * count), limit: count, where: {product_id, reported: false}, include: [{model: Models.Answers, where: {reported: false}, required: false, include: [{model: Models.Photos, required: false}]}], order: [['question_helpfulness', 'DESC'], [{model: Models.Answers}, 'helpfulness', 'DESC']]
    })
  },
  getAnswers: (question_id, page, count) => {
    page = page ? page : 1;
    count = count ? count : 5;
    return Models.Answers.findAll({
      offset: ((page - 1) * count), limit: count, where: {question_id, reported: false}, include: [{model: Models.Photos, required: false}], order: [['helpfulness', 'DESC']]
    })
  },
  addQuestion: (product_id, question_body, asker_name, asker_email) => {
    return Models.Questions.create({product_id, question_body, asker_name, asker_email})
  },
  addAnswer: (question_id, body, answerer_name, answerer_email, photos) => {
    return Models.Answers.create({question_id, body, answerer_name, answerer_email})
      .then((res) => {
        if (photos.length > 0) {
          var inserted = photos.map(photo => {
            return {
              url: photo,
              answer_id: res.id
            }
          })
          return Models.Photos.bulkCreate(inserted);
        } else {
          return new Promise((resolve, reject) => resolve());
        }
      })
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