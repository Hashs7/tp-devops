const formValidator = require('./form_validator');
const photoModel = require('./photo_model');
const { PubSub } = require('@google-cloud/pubsub');
const { Storage } = require('@google-cloud/storage');
const env = require('../project-id-9307823999230114798-b3157dde6a00');
const moment = require('moment');

function route(app) {
  app.get('/', (req, res) => {
    const tags = req.query.tags;
    const tagmode = req.query.tagmode;

    const ejsLocalVariables = {
      tagsParameter: tags || '',
      tagmodeParameter: tagmode || '',
      photos: [],
      searchResults: false,
      invalidParameters: false
    };

    // if no input params are passed in then render the view with out querying the api
    if (!tags && !tagmode) {
      return res.render('index', ejsLocalVariables);
    }

    // validate query parameters
    if (!formValidator.hasValidFlickrAPIParams(tags, tagmode)) {
      ejsLocalVariables.invalidParameters = true;
      return res.render('index', ejsLocalVariables);
    }

    // get photos from flickr public feed api
    return photoModel
      .getFlickrPhotos(tags, tagmode)
      .then(photos => {
        ejsLocalVariables.photos = photos;
        ejsLocalVariables.searchResults = true;
        return res.render('index', ejsLocalVariables);
      })
      .catch(error => {
        return res.status(500).send({ error });
      });
  });
  
  app.post('/zip', (req, res) => {
    const tags = req.query.tags;
    const tagmode = req.query.tagmode;

    const env = require('../project-id-9307823999230114798-b3157dde6a00');
    const credentials = {
      projectId: env.project_id,
      credentials: env
    };
    const pubsub = new PubSub(credentials);
    const topic = pubsub.topic('sebastien');
    topic.publish(Buffer.from(JSON.stringify({ tags, tagmode })));
    res.status(200).send({ message: 'sended' });
  });

  app.get('/zip', (req, res) => {
    const tags = req.query.tags;

    const credentials = {
      projectId: env.project_id,
      credentials: env
    };
    const options = {
      action: 'read',
      expires: moment().add(2, 'days').unix() * 1000
    };

    const storage = new Storage(credentials);
      storage
        .bucket('dmii2bucket')
        .file(`seb_${tags}.zip`)
        .getSignedUrl(options)
        .then(signedUrls => {
          res.redirect(signedUrls[0])
        });
  })
}

module.exports = route;
