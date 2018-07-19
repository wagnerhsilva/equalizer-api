var express = require('express');
var router = express.Router();
var Modulo = require('../models/Modulo');
var bCrypt = require('bcrypt-nodejs');
/* GET */
router.get('/', function (req, res, next) {
    Modulo.getAll(function (err, modulos) {
        console.log("tendanalitics");
        if (err) return next(err);
        console.log(modulos);
        res.json(modulos);
    });
});
/* GET /modulo/id */
router.get('/:id', function (req, res, next) {
    Modulo.getById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
module.exports = router;
/* POST */
router.post('/', function (req, res, next) {

});
/* PUT /modulo/:id */
router.put('/', function (req, res, next) {
   
});