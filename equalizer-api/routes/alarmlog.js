var express = require('express');
var router = express.Router();
var AlarmLog = require('../models/AlarmLog');
var bCrypt = require('bcrypt-nodejs');
/* GET */
router.get('/', function (req, res, next) {
    AlarmLog.getAll(function (err, alarmLog) {
        if (err) return next(err);
        res.json(alarmLog);
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