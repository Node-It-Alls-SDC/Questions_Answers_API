module.exports.transformQuestion = (question) => {
  var raw = JSON.parse(JSON.stringify(question));
  for (var i = 0; i < raw.length; i++) {
    raw[i]['answers'] = Object.fromEntries(raw[i].answers.map(answer => {
      return [answer.id, answer];
    }))
  }
  return raw
}

