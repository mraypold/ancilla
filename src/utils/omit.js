

/**
 * Removes a key from an object and then returns it.
 *
 * Essentially a clone of the lodash omit function.
 *
 * @param {object} obj The object we're going to remove a key from.
 * @param {string} prop The object property/key to remove.
 */
module.exports = (obj, prop) => {
  const res = Object.assign({}, obj);
  delete res[prop];
  return res;
};
