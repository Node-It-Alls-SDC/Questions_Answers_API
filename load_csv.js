// const dbname = db.getSiblingDB('Questions');
// dbname.getCollection("Questions");

const fs = require('fs');
const csv = require('csv-parser');

const questions = './data/questions.csv';
const answers = './data/answers.csv';
const photos = './data/answers_photos.csv';
var questionsData = {};

fs.createReadStream(questions)
  .pipe(csv())
  .on('data', question => {
    Object.assign(question, {answers: {}});
    questionsData[Number(question['id'])] = question;
  })
  .on('error', err => {
    console.error(err.message);
  })
  .on('end', () => {
    console.log('Questions read successfully');
    fs.createReadStream(answers)
      .pipe(csv())
      .on('data', answer => {
        Object.assign(answer, {photos: []});
        questionsData[answer['question_id']]['answers'][Number(answer['id'])] = answer;
      })
      .on('error', err => {
        console.error(err.message);
      })
      .on('end', () => {
        questionsData = [...Object.values(questionsData)];
        var i = 0;
        fs.createReadStream(photos)
          .pipe(csv())
          .on('data', photo => {
            for (i; i < questionsData.length; i++) {
              if (questionsData[i]['answers'][photo['answer_id']]) {
                questionsData[i]['answers'][photo['answer_id']]['photos'].push(photo);
                break;
              }
            }
          })
          .on('error', err => {
            console.error(err.message);
          })
          .on('end', () => {
            console.log('Photos read successfully')
          })
      })
  })

