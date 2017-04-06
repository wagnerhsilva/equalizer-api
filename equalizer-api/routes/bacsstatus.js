var express = require('express');
var router = express.Router();
var BACSStatus = require('../models/BACSStatus');
/* GET */
router.get('/', function (req, res, next) {
    BACSStatus.find(function (err, BACSStatus) {
        if (err) return next(err);
        res.json(BACSStatus);
    });
});
/* GET /usuarios/id */
router.get('/:id', function (req, res, next) {
    BACSStatus.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
module.exports = router;
/* POST */
router.post('/', function (req, res, next) {
    BACSStatus.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
/* PUT /usuarios/:id */
router.put('/:id', function (req, res, next) {
    BACSStatus.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
/* DELETE /usuarios/:id */
router.delete('/:id', function (req, res, next) {
    BACSStatus.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});