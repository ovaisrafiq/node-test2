require('dotenv').config();
const knex = require('knex');
const debug = require('../../helpers/debug')('knex:config');

const environment = process.env.NODE_ENV || 'development';
debug('using environment: %s', environment);

const config = require('./knexfile')[environment];
debug('knex config: %o', config);

module.exports = knex(config);
