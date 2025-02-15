// const dbname = db.getSiblingDB('Questions');
// dbname.getCollection("Questions");
const fs = require('fs');
const csv = require('csv-parser');
const questions = './data/questions.csv';
const answers = './data/answers.csv';
const photos = './data/answers_photos.csv';

const BATCHSIZE = 20000;

const questionStream = (Questions) => {
  return new Promise ((resolve, reject) => {
    var questionsData = [];
    fs.createReadStream(questions)
    .pipe(csv({
      mapHeaders: ({ header, index }) => {
        switch (header) {
          case 'id':
          case 'body':
            return 'question_' + header
          case 'date_written':
            return 'question_date'
          case 'helpful':
            return 'question_helpfulness'
          default:
            return header;
        }
      },
      mapValues: ({ header, index, value}) => {
        switch (header) {
          case 'question_id':
          case 'product_id':
          case 'question_helpfulness':
          case 'reported':
            return Number(value);
          case 'question_date':
            return new Date(Number(value));
          default:
            return value;
        }
      }
    }))
    .on('data', question => {
      questionsData.push(question);
      if (questionsData.length === BATCHSIZE) {
        var inserted = questionsData.slice();
        questionsData = [];
        Questions.bulkCreate(inserted)
          .catch((err) => reject(err))
      }
    })
    .on('error', err => {
      reject(err.message);
    })
    .on('end', () => {
      Questions.bulkCreate(questionsData)
        .then(() => resolve('Questions submitted successfully'))
        .catch((err) => reject(err))
    })
  })
}

module.exports.questionStream = questionStream;

const answerStream = (Answers) => {
  return new Promise ((resolve, reject) => {
    var answersData = [];
    fs.createReadStream(answers)
    .pipe(csv({
      mapHeaders: ({ header, index }) => {
        switch (header) {
          case 'id':
            return 'answer_id';
          case 'date_written':
            return 'date';
          case 'helpful':
            return 'helpfulness'
          default:
            return header;
        }
      },
      mapValues: ({ header, index, value}) => {
        switch (header) {
          case 'answer_id':
          case 'question_id':
          case 'helpfulness':
          case 'reported':
            return Number(value);
          case 'date':
            return new Date(Number(value));
          default:
            return value;
        }
      }
    }))
    .on('data', answer => {
      answersData.push(answer);
      if (answersData.length === BATCHSIZE) {
        var inserted = answersData.slice();
        answersData = [];
        Answers.bulkCreate(inserted)
          .catch((err) => reject(err))
      }
    })
    .on('error', err => {
      reject(err.message);
    })
    .on('end', () => {
      Answers.bulkCreate(answersData)
        .then(() => resolve('Answers submitted successfully'))
        .catch((err) => reject(err))
    })
  })
}
module.exports.answerStream = answerStream;

const photoStream = (Photos) => {
  return new Promise ((resolve, reject) => {
    var photosData = [];
    fs.createReadStream(photos)
    .pipe(csv())
    .on('data', photo => {
      photosData.push(photo);
      if (photosData.length === BATCHSIZE) {
        var inserted = photosData.slice();
        photosData = [];
        Photos.bulkCreate(inserted)
          .catch((err) => reject(err))
      }
    })
    .on('error', err => {
      reject(err.message);
    })
    .on('end', () => {
      Photos.bulkCreate(photosData)
        .then(() => resolve('Finished ETL Process'))
        .catch((err) => reject(err))
    })
  })
}
module.exports.photoStream = photoStream;
