module.exports.transformQuestion = (question) => {
  var raw = JSON.parse(JSON.stringify(question));
  for (var i = 0; i < raw.length; i++) {
    raw[i]['answers'] = Object.fromEntries(raw[i].answers.map(answer => {
      return [answer.id, answer];
    }))
  }
  return raw
}

module.exports.transformAnswer = (answer) => {
  var raw = JSON.parse(JSON.stringify(answer));
    for (var i = 0; i < raw.length; i++) {
      delete raw[i].updatedAt;
      delete raw[i].reported;
      raw[i]['photos'] = raw[i].photos.map(photo => {
        return { id: photo.id, url: photo.url }
      })
    }
  return raw
}
