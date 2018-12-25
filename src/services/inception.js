const grpc = require('grpc');
const softmax = require('softmax-fn');
const request = require('request').defaults({ encoding: null });
const path = require('path');

const protoPath = path.join(__dirname, '/../proto/prediction_service.proto');
const tensorflowServing = grpc.load(protoPath).tensorflow.serving;

/**
 * Connection properties for Tensorflow Serving.
 *
 * These should match those in docker-compose.
 */
const servingHost = process.env.TENSORFLOW_SERVING_HOST || 'localhost';
const servingPort = process.env.TENSORFLOW_SERVING_PORT || '8500';

const endpoint = `${servingHost}:${servingPort}`;

const client = new tensorflowServing.PredictionService(endpoint, grpc.credentials.createInsecure());

/**
 * Builds a gPRC message for Tensorflow serving that conforms to the inception model.
 *
 * You can get additional details on the available procedures here:
 * @see {@link localhost:8501/v1/models/inception/metadata tensorflow meta data api}
 * @see {@link ./../proto exported proto files}
 *
 * @param {Buffer[]} encodedImageBuffer An array of buffers containing base64 ecnoded images
 * @returns {object} A formatted RPC message.
 */
const buildClassificationMessage = encodedImageBuffer => ({
  model_spec: {
    name: 'inception',
    signature_name: 'predict_images',
  },
  inputs: {
    images: {
      dtype: 'DT_STRING',
      tensor_shape: {
        dim: {
          size: encodedImageBuffer.length,
        },
      },
      string_val: encodedImageBuffer,
    },
  },
});

/**
 * Makes an RPC to the Tensorflow Serving service and returns the predicted objects.
 *
 * @param {string} imageUrl A fully qualified domain contiaining a image to predict objects for.
 * @returns {Promise.<object, object>} A promise containing the prediction or an error.
 */
const predict = async imageUrl => new Promise((resolve, reject) => {
  const options = {
    url: imageUrl,
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
  };

  request.get(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const buffer = [
        Buffer.from(body).toString('base64'),
      ];

      const msg = buildClassificationMessage(buffer);

      client.predict(msg, (err, prediction) => {
        if (err) {
          reject(err);
        }

        const classes = prediction.outputs.classes.string_val.map(b => b.toString('utf8'));
        const percents = softmax(prediction.outputs.scores.float_val);

        const results = [];

        for (let i = 0; i < classes.length; i += 1) {
          results.push({
            classes: classes[i].split(',').map(x => x.trim()),
            confidence: percents[i],
          });
        }

        resolve(results);
      });
    } else {
      reject();
    }
  });
});

module.exports = predict;
