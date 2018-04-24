var express = require('express');
var router = express.Router();
var AlarmeConfig = require('../models/AlarmeConfig');
var bCrypt = require('bcrypt-nodejs');
/* GET */
router.get('/', function (req, res, next) {
    AlarmeConfig.getAll(function (err, alarmesConfig) {
        if (err) return next(err);
        res.json(alarmesConfig);
    });
});
/* GET /alarmeConfig/id */
router.get('/:id', function (req, res, next) {
    AlarmeConfig.getById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
module.exports = router;
/* POST */
router.post('/', function (req, res, next) {
    var alarmeConfigPost = req.body;
    var newAlarmeConfig = new AlarmeConfig.createAlarmeConfig('',  moduloPost.descricao, moduloPost.tensao_nominal, moduloPost.n_strings, moduloPost.n_baterias_por_strings, moduloPost.contato, 
                                            moduloPost.localizacao, moduloPost.fabricante, moduloPost.tipo, moduloPost.data_instalacao, moduloPost.conf_alarme_id);
                        // save the user
                        AlarmeConfig.save(newUser, function(err) {
                            if (err){
                                console.log('Erro ao salvar o alarme config.: '+err);
                                throw err;  
                            }
                            console.log('Alarme config. salvo com sucesso');    
                        });

});
/* PUT /alarmeConfig/:id */
router.put('/', function (req, res, next) {
    AlarmeConfig.update(req.body);
    res.json(req.body);
});