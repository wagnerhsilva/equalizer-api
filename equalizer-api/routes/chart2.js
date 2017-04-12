var express = require('express');
var router = express.Router();
var StatusModulo = require('../models/StatusModulo');
var bCrypt = require('bcrypt-nodejs');
/* GET */
router.get('/', function (req, res, next) {
    StatusModulo.get(function (err, statusModulos) {
        console.log("getChart2");
        if (err) return next(err);
        console.log(statusModulos);
        res.json(statusModulos);
    });
});
/* GET /statusmodulo/id */
router.get('/:id', function (req, res, next) {
    
});
module.exports = router;
/* POST */
router.post('/', function (req, res, next) {
   
});
/* PUT /statusmodulo/:id */
router.put('/', function (req, res, next) {
});