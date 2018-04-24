var express = require('express');
var router = express.Router();
var Modulo = require('../models/Modulo');
var bCrypt = require('bcrypt-nodejs');
/* GET */
router.get('/', function (req, res, next) {
    Modulo.getAll(function (err, modulos) {
        console.log("getModule");
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
    var moduloPost = req.body;
    var newModulo = new Modulo.createModulo('', moduloPost.descricao, moduloPost.tensao_nominal, modulo.capacidade_nominal, moduloPost.n_strings, moduloPost.n_baterias_por_strings, moduloPost.contato,
        moduloPost.localizacao, moduloPost.fabricante, moduloPost.tipo, moduloPost.data_instalacao, moduloPost.conf_alarme_id, modulo.baterias_por_hr);
    // save the user
    Modulo.save(newModulo, function (err) {
        if (err) {
            console.log('Erro ao salvar o módulo: ' + err);
            throw err;
        }
        console.log('Módulo salvo com sucesso');
    });

});
/* PUT /modulo/:id */
router.put('/', function (req, res, next) {
    var moduloAnterior = Modulo.getById(req.body.id, function (err, modulo) {
        if ((modulo.n_strings != req.body.n_strings) || (modulo.n_baterias_por_strings != req.body.n_baterias_por_strings)) {
            var sqlite3 = require('sqlite3').verbose();
            var db = new sqlite3.Database('equalizerdb');
            db.run('PRAGMA busy_timeout = 60000;');
            db.run('PRAGMA journal_mode=WAL;');
            db.run('DELETE FROM DataLog;');
            console.log("DataLog cleared");
        }
        Modulo.update(req.body);
        res.json(req.body);
    });

});