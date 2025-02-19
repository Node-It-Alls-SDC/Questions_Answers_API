module.exports.transformQuestion = (question) => {
  return new Promise((res, rej) => {
    var raw = JSON.parse(JSON.stringify(question));
    for (var i = 0; i < raw.length; i++) {
      var map = {};
      for (var j = 0; j < raw[i].answers.length; j++) {
        map[raw[i].answers[j]['id']] = raw[i].answers[j];
      }
      raw[i]['answers'] = map;
    }
    res(raw)
  })
}

module.exports.transformPhotos = (req, res, next) => {
  req.body.photos = req.body.photos?.map(photo => {return {url:photo}});
  next();
}
