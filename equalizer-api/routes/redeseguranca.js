var express = require('express');
var router = express.Router();
var RedeSeguranca = require('../models/RedeSeguranca');
/* GET */
router.get('/', function (req, res, next) {
    RedeSeguranca.find(function (err, redeSeguranca) {
        if (err) return next(err);
        res.json(redeSeguranca);
    });
});
/* GET /redeseguranca/id */
router.get('/:id', function (req, res, next) {
    RedeSeguranca.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
module.exports = router;
/* POST */
router.post('/', function (req, res, next) {
    RedeSeguranca.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
/* PUT /redeseguranca/:id */
router.put('/:id', function (req, res, next) {
    RedeSeguranca.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
/* DELETE /redeseguranca/:id */
router.delete('/:id', function (req, res, next) {
    RedeSeguranca.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});