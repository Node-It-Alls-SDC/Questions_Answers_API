// const dbname = db.getSiblingDB('Questions');
// dbname.getCollection("Questions");
const fs = require('fs');
const csv = require('csv-parser');

const questions = './data/questions.csv';
const answers = './data/answers.csv';
const photos = './data/answers_photos.csv';



const questionStream = () => {
  var questionsData = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(questions)
    .pipe(csv({
      mapHeaders: ({ header, index }) => {
        switch (header) {
          case 'id':
            return '_id';
          case 'date_written':
            return 'createdAt';
          default:
            return header;
        }
      },
      mapValues: ({ header, index, value}) => {
        switch (header) {
          case '_id':
          case 'product_id':
          case 'reported':
          case 'helpful':
            return Number(value);
          case 'createdAt':
            return new Date(Number(value));
          default:
            return value;
        }
      }
    }))
    .on('data', question => {
      question['answers'] = {};
      questionsData.push(question);
    })
    .on('error', err => {
      console.error(err.message);
    })
    .on('end', () => {
      resolve(questionsData);
      console.log('Questions read successfully');
    })
  })
}
module.exports.questionStream = questionStream;
  // fs.createReadStream(answers)
  // .pipe(csv())
  // .on('data', answer => {
  //   answer['id'] = Number(answer['id']);
  //   answer['question_id'] = Number(answer['question_id']);
  //   answer['date_written'] = new Date(Number(answer['date_written']));
  //   answer['reported'] = Number(answer['reported']);
  //   answer['helpful'] = Number(answer['helpful']);
  //   answer['photos'] = [];
  //   questionsData[answer['question_id']]['answers'][answer['id']] = answer;
  // })
  // .on('error', err => {
  //   console.error(err.message);
  // })
  // .on('end', () => {
  //   questionsData = [...Object.values(questionsData)];
  //   var i = 0;
  //   fs.createReadStream(photos)
  //     .pipe(csv())
  //     .on('data', photo => {
  //       for (i; i < questionsData.length; i++) {
  //         if (questionsData[i]['answers'][photo['answer_id']]) {
  //           photo['id'] = Number(answer['id']);
  //           photo['answer_id'] = Number(photo['answer_id']);
  //           console.log(photo);
  //           questionsData[i]['answers'][photo['answer_id']]['photos'].push(photo);
  //           break;
  //         }
  //       }
  //     })
  //     .on('error', err => {
  //       console.error(err.message);
  //     })
  //     .on('end', () => {
  //       console.log('Photos read successfully')
  //     })
  // })