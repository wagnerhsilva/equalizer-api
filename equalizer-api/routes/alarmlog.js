var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var AlarmLog = require('../models/AlarmLog');
/* GET */
router.get('/', function (req, res, next) {
    AlarmLog.find(function (err, AlarmLog) {
        if (err) return next(err);
        res.json(AlarmLog);
    });
});
/* GET /alarmlog/id */
router.get('/:id', function (req, res, next) {
    AlarmLog.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
module.exports = router;
/* POST */
router.post('/', function (req, res, next) {
    AlarmLog.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
/* PUT /alarmlog/:id */
router.put('/:id', function (req, res, next) {
    AlarmLog.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
/* DELETE /alarmlog/:id */
router.delete('/:id', function (req, res, next) {
    AlarmLog.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});