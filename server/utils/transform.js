module.exports.transformQuestion = (question) => {
  var raw = JSON.parse(JSON.stringify(question));
  for (var i = 0; i < raw.length; i++) {
    delete raw[i].updatedAt;
    raw[i]['answers'] = Object.fromEntries(raw[i].Answers.map(answer => {
      var map = {
        id: answer.answer_id,
        body: answer.body,
        date: answer.date,
        answerer_name: answer.answerer_name,
        helpfulness: answer.helpfulness,
        photos: answer.Photos.map(photo => {
          return {
            id: photo.id,
            url: photo.url
          }
        })
      }
      return [answer.answer_id, map];
    }))
    delete raw[i].Answers;
  }
  return raw
}

module.exports.transformAnswer = (answer) => {
  var raw = JSON.parse(JSON.stringify(answer));
    for (var i = 0; i < raw.length; i++) {
      delete raw[i].updatedAt;
      delete raw[i].reported;
      raw[i]['photos'] = raw[i].Photos.map(photo => {
        return { id: photo.id, url: photo.url }
      })
      delete raw[i].Photos;
    }
  return raw
}
