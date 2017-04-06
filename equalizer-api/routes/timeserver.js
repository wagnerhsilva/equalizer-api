var express = require('express');
var router = express.Router();
var TimeServer = require('../models/TimeServer');
/* GET */
router.get('/', function (req, res, next) {
    TimeServer.find(function (err, timeServers) {
        if (err) return next(err);
        res.json(timeServers);
    });
});
/* GET /timeserver/id */
router.get('/:id', function (req, res, next) {
    TimeServer.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
module.exports = router;
/* POST */
router.post('/', function (req, res, next) {
    TimeServer.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
/* PUT /timeserver/:id */
router.put('/:id', function (req, res, next) {
    TimeServer.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
/* DELETE /timeserver/:id */
router.delete('/:id', function (req, res, next) {
    TimeServer.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});