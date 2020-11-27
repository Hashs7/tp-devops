const formValidator = require('./form_validator');
const photoModel = require('./photo_model');
const { PubSub } = require('@google-cloud/pubsub');

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
        console.log(photos);
        ejsLocalVariables.photos = photos;
        ejsLocalVariables.searchResults = true;
        return res.render('index', ejsLocalVariables);
      })
      .catch(error => {
        return res.status(500).send({ error });
      });
  });
  
  app.post('/zip', async (req, res) => {
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
    res.status(200)
  });
}

module.exports = route;
