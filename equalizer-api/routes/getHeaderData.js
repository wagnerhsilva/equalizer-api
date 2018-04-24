var express = require('express');
var router = express.Router();
var DataLog = require('../models/DataLog');
/* GET */
router.get('/', function (req, res, next) {
    DataLog.getAvgLast(function (err, avgLast) {
        res.json({ somaTensao: avgLast.soma, avg: avgLast.avg, capBanco: avgLast.capBanco });
    });

});
/* GET /timeserver/id */
router.get('/:id', function (req, res, next) {
 
});
module.exports = router;
/* POST */
router.post('/', function (req, res, next) {
    res.json("{emailEnviado:true}");
});
/* PUT /timeserver/:id */
router.put('/', function (req, res, next) {
    res.json(req.body);
});
/* DELETE /timeserver/:id */
router.delete('/:id', function (req, res, next) {

});

/* DELETE /timeserver/:id */
router.delete('/:id', function (req, res, next) {

});