const Koa = require('koa');

const app = new Koa();

/**
 * Add more advanced logging to stdout for routes / times.
 *
 * @see {@link https://github.com/koajs/logger koa-logger}
 */
const koaLogger = require('koa-logger');
const logger = require('./utils/logger');

app
  .use(koaLogger({
    transporter: str => logger.info(str),
  }));

/**
 * Allow the application to have consistent json formatted error messages.
 *
 * @see {@link https://github.com/koajs/json-error koa-json-error}
 */
const error = require('koa-json-error');
const omit = require('./utils/omit');

const options = {
  // Avoid showing the stacktrace in 'production' env
  postFormat: (e, obj) => (process.env.NODE_ENV === 'production' ? omit(obj, 'stack') : obj),
};

app
  .use(error(options));

/**
 * Allow Koa to inspect POST and PUT requests.
 *
 * @see {@link https://github.com/dlau/koa-body koa-body}
 */
const koaBody = require('koa-body');

app
  .use(koaBody({
    jsonLimit: '1kb',
  }));

/**
 * The Routes we will use within the application.
 *
 * @see {@link https://github.com/alexmingoia/koa-router koa-router}
 * @see {@link ./routes routing files}
 */
const detectionRoutes = require('./routes/detection');

app
  .use(detectionRoutes.routes())
  .use(detectionRoutes.allowedMethods());


module.exports = app;
