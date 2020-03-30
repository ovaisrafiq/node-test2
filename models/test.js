/**
 * @author: Ovais Rafique
 * @syntax: ES6
 */

const Knex = require('../config/db/knex');

class ModelTest {

    constructor(origin) {
        this.knex = new Knex(origin);
    }

    async getDatabase() {
        return await this.knex.raw('SELECT DATABASE()');
    }
}

module.exports = ModelTest;


