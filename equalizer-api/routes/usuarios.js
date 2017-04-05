var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Usuario = require('../models/Usuario');
/* GET */
router.get('/', function (req, res, next) {
    Usuario.getAll(function (err, usuarios) {
        if (err) return next(err);
        res.json(usuarios);
    });
});
/* GET /usuarios/id */
router.get('/:id', function (req, res, next) {
    Usuario.getById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
module.exports = router;
/* POST */
router.post('/', function (req, res, next) {
    Usuario.createUser(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
/* PUT /usuarios/:id */
router.put('/:id', function (req, res, next) {
    console.log(req.body);
    Usuario.updateAcesso(req.body);
    res.json(req.body);
});
/* DELETE /usuarios/:id */
router.delete('/:id', function (req, res, next) {
    Usuario.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});