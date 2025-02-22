const express = require('express');
const compression = require('compression');
require('dotenv').config();
const controller = require('./controller.js');
const {transformQuestion, transformPhotos} = require('./utils/transform.js');
const cluster = require("cluster");
const os = require('os');
const NodeCache = require( "node-cache" );
const cache = new NodeCache
const getCache = (req, res, next) => {
  var data;
  if (req.query.product_id) {
    data = cache.get(req.query.product_id + 'q');
  } else if (req.params.question_id) {
    data = cache.get(req.params.question_id + 'a')
  }
  if (data) {
    res.send(data);
  } else {
    next();
  }
}

const deleteCache = (req, res, next) => {
  var data;
  if (req.query.product_id) {
    data = cache.get(req.query.product_id + 'q');
    if (data) {
      cache.del(req.query.product_id + 'q')
    }
  } else if (req.params.question_id) {
    data = cache.get(req.params.question_id + 'a')
    if (data) {
      cache.del(req.params.question_id + 'a')
    }
  }
  next();
}
if (cluster.isMaster) {
  const CPUs = os.cpus().length;
  for(let i = 0; i< CPUs; i++){
    cluster.fork()
  }
  cluster.on('exit', (worker, code, signal) => {
    cluster.fork();
  });
} else {
  const app = express();
  app.use(express.json());

  app.get('/loaderio-63274c965b827a70b2f6d692581f6e0a', (req, res) => {
    res.send('loaderio-63274c965b827a70b2f6d692581f6e0a');
  })

  app.get('/', (req, res) => {
    res.send('This is the API for Questions and Answers\nIf you want to look at questions for a certain product\nJust go to /qa for more information or look at the documentation in the ReadMe file')
  })

  app.get('/qa', (req, res) => {
    res.send('To look at questions go to /qa/questions?product_id=?\nTo look at answers go to /qa/questions/:question_id/answers')
  })

  //GET Questions
  app.get('/qa/questions', getCache, (req, res) => {
    controller.getQuestions(req.query.product_id, Number(req.query?.page), Number(req.query?.count))
      .then(result => {
        transformQuestion(result)
          .then(tq => {
            cache.set(req.query.product_id + 'q', {product_id: Number(req.query.product_id), results: tq}, 10000 );
            res.send({product_id: Number(req.query.product_id), results: tq})
          })
          .catch(err => console.error(err))
      })
      .catch(err => {
        res.status(500).send(err)
      })
  })

  //GET Answers
  app.get('/qa/questions/:question_id/answers', getCache, (req, res) => {
    var question_id = Number(req.params.question_id);
    var page = Number(req.query?.page) ? Number(req.query?.page) : 1;
    var count = Number(req.query?.count) ? Number(req.query?.count) : 5;
    controller.getAnswers(question_id, page, count)
      .then(result => {
        cache.set(req.params.question_id + 'a', {
          question: question_id,
          page: page ? page : 1,
          count: count ? count : 5,
          results: JSON.parse(JSON.stringify(result))
        }, 10000)
        res.send({
          question: question_id,
          page: page ? page : 1,
          count: count ? count : 5,
          results: result
        })
      })
      .catch(err => {
        console.error(err)
        res.status(500).send(err)
      })
  })

  //POST Questions
  app.post('/qa/questions', deleteCache, (req, res) => {
    controller.addQuestion(req.body.product_id, req.body.body, req.body.name, req.body.email)
      .then(() => res.sendStatus(201))
      .catch(err => res.status(500).send(err))
  })

  //POST Answers
  app.post('/qa/questions/:question_id/answers', deleteCache, transformPhotos, (req, res) => {
    controller.addAnswer(req.params.question_id, req.body.body, req.body.name, req.body.email, req.body.photos)
      .then(() => res.sendStatus(201))
      .catch(err => res.status(500).send(err))
  })

  //Increase helpfulness of Question by 1
  app.put('/qa/questions/:question_id/helpful', (req, res) => {
    controller.helpfulQuestion(req.params.question_id)
      .then(() => res.sendStatus(204))
      .catch(err => res.status(500).send(err))
  })

  //Mark question as reported
  app.put('/qa/questions/:question_id/report', deleteCache, (req, res) => {
    controller.reportQuestion(req.params.question_id)
      .then(() => res.sendStatus(204))
      .catch(err => res.status(500).send(err))
  })

  //Increase helpfulness of Answer by 1
  app.put('/qa/answers/:answer_id/helpful', (req, res) => {
    controller.helpfulAnswer(req.params.answer_id)
      .then(() => res.sendStatus(204))
      .catch(err => res.status(500).send(err))
  })

  //Mark answer as reported
  app.put('/qa/answers/:answer_id/report', (req, res) => {
    controller.reportAnswer(req.params.answer_id)
      .then(() => res.sendStatus(204))
      .catch(err => res.status(500).send(err))
  })

  module.exports = app.listen(process.env.PORT, () => {
    console.log(`QA API listening on port ${process.env.PORT}`)
  })
}




