const debug = require('debug');

module.exports = (n) => {
    return debug(`nodetest${n}`);
};
