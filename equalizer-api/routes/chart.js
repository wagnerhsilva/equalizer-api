var express = require('express');
var router = express.Router();
var StatusModulo = require('../models/StatusModulo');
var bCrypt = require('bcrypt-nodejs');
/* GET */
router.get('/', function (req, res, next) {
    StatusModulo.getChartDefault(5, function (err, chartDay) {
        console.log("getChart");
        if (err) return next(err);
        console.log(chartDay);
        res.json(chartDay);
    });
});
/* GET /statusmodulo/id */
router.get('/:nbat/:string/:dataInicial/:dataFinal/:visao', function (req, res, next) {
    var qtdBats = parseInt(req.params.nbat);
    var string = req.params.string;
    var dtInicial = req.params.dataInicial;
    var dtFinal = req.params.dataFinal;
    var visao = parseInt(req.params.visao);
    var params = {
        totalBaterias: qtdBats,
        string: string,
        dtInicial: dtInicial,
        dtFinal: dtFinal,
        visao: visao
    }
    StatusModulo.getChartDefault(params, function (err, chartDay) {
        console.log("getChart novo");
        if (err) return next(err);
        res.json(chartDay);
    });
});

module.exports = router;
/* POST */
router.post('/', function (req, res, next) {

});
/* PUT /statusmodulo/:id */
router.put('/', function (req, res, next) {
});