const express = require('express');
const router = express.Router();
const ModelTest = require('../models/test');
const debug = require('debug')('Route:Test');

router.get('/test', async (req, res) => {
    try {
        let modelTest = new ModelTest(req.headers.origin);
        let database = await modelTest.getDatabase();
        res.json(database);
    } catch (error) {
        throw error;
    }

});


module.exports = router;
