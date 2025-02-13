module.exports.transformQuestion = (question) => {
  var raw = JSON.parse(JSON.stringify(question));
  var formatted = raw.map(question => {
    return {
      question_id: question.id,
      question_body: question.body,
      question_date: question.createdAt,
      asker_name: question.asker_name,
      question_helpfulness: question.helpful,
      reported: question.reported,
      answers: Object.fromEntries(question.Answers.map(answer => {
        map = {
          id: answer.id,
          body: answer.body,
          date: answer.createdAt,
          answerer_name: answer.answerer_name,
          helpfulness: answer.helpful,
          photos: answer.Photos.map(photo => {
            return {
              id: photo.id,
              url: photo.url
            }
          })
        }
        return [answer.id, map]
      }))
    }
  })
  return formatted
}