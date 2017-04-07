var express = require('express');
var router = express.Router();
var DataLog = require('../models/DataLog');
var bCrypt = require('bcrypt-nodejs');
/* GET */
router.get('/', function (req, res, next) {
    DataLog.getAll(function (err, dataLog) {
        if (err) return next(err);
        res.json(dataLog);
    });
});
/* GET /dataLog/id */
router.get('/:id', function (req, res, next) {
});
module.exports = router;
/* POST */
router.post('/', function (req, res, next) {

});
/* PUT /dataLog/:id */
router.put('/', function (req, res, next) {
});