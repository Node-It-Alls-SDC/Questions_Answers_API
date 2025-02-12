const Models = require('./db.js');
const {questionStream, answerStream, photoStream} = require('./extract.js');

questionStream(Models.Questions)
  .then((firstres) => {
    console.log(firstres);
    answerStream(Models.Answers)
      .then((secondres) => {
        console.log(secondres);
        photoStream(Models.Photos)
          .then((thirdres) => {
            console.log(thirdres);
          })
          .catch(err => console.error(err))
      })
      .catch(err => console.error(err))
  })
  .catch(err => console.error(err))