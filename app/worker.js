// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub');
const request = require('request');
const ZipStream = require('zip-stream');
const photoModel = require('./photo_model');
const env = require('../project-id-9307823999230114798-b3157dde6a00');

async function quickstart(
  projectId = 'project-id-9307823999230114798', // Your Google Cloud Platform project ID
  topicName = 'sebastien', // Name for the new topic to create
  subscriptionName = 'sebastien' // Name for the new subscription to create
) {
  const credentials = {
    projectId: env.project_id,
    credentials: env
  };
  const pubsub = new PubSub(credentials);
  // Instantiates a client
  const topic = await pubsub.topic(topicName);
  console.log(`Topic ${topic.name}.`);


  function listenForMessages() {
    const timeout = 60;
    // References an existing subscription
    const subscription = pubsub.subscription(topicName);

    // Create an event handler to handle messages
    let messageCount = 0;
    const messageHandler = async message => {
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${message.attributes}`);
      messageCount += 1;

/*      const zip = new ZipStream();
      // zip.pipe(res);
      const photos = await photoModel.getFlickrPhotos(message.data.tags);

      function addNextFile() {
        const elem = photos.shift();
        const stream = request(elem.media.m);
        zip.entry(stream, { name: elem.title }, err => {
          if (err)
            throw err;
          if (photos.length > 0)
            addNextFile();
          else
            zip.finalize();
        });
      }

      addNextFile();*/

      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };

    // Listen for new messages until timeout is hit
    subscription.on('message', messageHandler);

    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      console.log(`${messageCount} message(s) received.`);
    }, timeout * 1000);
  }

  listenForMessages();
}

quickstart();