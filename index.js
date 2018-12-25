/**
 * This is a simple Koa based server to interface with the inception v3 object
 * detection model hosted by Tensorflow Serving.
 *
 * @see {@link https://koajs.com/ koa}
 * @see {@link https://www.tensorflow.org/serving/ tensorflow-serving}
 * @author Michael Raypold
 * @license MIT
 */

const server = require('./src/server');

server
  .listen(process.env.PORT || 3000);
