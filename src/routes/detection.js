const router = require('koa-router')();
const validUrl = require('valid-url');
const predict = require('../services/inception');
const logger = require('../utils/logger');

/**
 * This is our main prediction endpoint that runs object detection on a provided image URL.
 *
 * The user calls this endpoint with a json body formatted like so.
 * {
 *    "image": "https://example.org/example-image.jpg"
 * }
 */
router.post('/', async (ctx) => {
  const { request: { body } } = ctx;

  // We cant run a prediction when a URL doesn't exist.
  if (!body.image) {
    ctx.throw(400, 'The image field must contain a URL.');
  }

  // We cant run a prediction on provided an invalid URL.
  if (!validUrl.isWebUri(body.image) || !validUrl.isUri(body.image)) {
    ctx.throw(400, 'A properly formatted URL is required in the image field. Make sure to use HTTP or HTTPS');
  }

  let predictions = [];

  try {
    predictions = await predict(body.image);
  } catch (err) {
    logger.error(err);
    ctx.throw(400, 'Unable to process image URL.');
  }

  ctx.body = {
    image: body.image,
    predictions,
  };
});

module.exports = router;
