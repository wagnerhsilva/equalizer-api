var express = require('express');
var router = express.Router();
var RedeSeguranca = require('../models/RedeSeguranca');
/* GET */
router.get('/', function (req, res, next) {
    RedeSeguranca.getAll(function (err, redeSeguranca) {
        if (err) return next(err);
        res.json(redeSeguranca);
    });
});
/* GET /redeseguranca/id */
router.get('/:id', function (req, res, next) {
    
});
/* POST */
router.post('/', function (req, res, next) {
    console.log(req.body);
    RedeSeguranca.getAll(function (err, redeSeguranca) {
        if (redeSeguranca.length > 0) {
            RedeSeguranca.update(req.body);
            res.render('redesegurancaview', { title: 'Rede & Segurança', username: req.user.nome, usuarios: usuarios, network: obj, redeSeguranca: redeSeguranca });
        } else {
            RedeSeguranca.save(req.body);
            res.render('redesegurancaview', { title: 'Rede & Segurança', username: req.user.nome, usuarios: usuarios, network: obj, redeSeguranca: redeSeguranca });
        }
    });
});

/* PUT /redeseguranca/:id */
router.put('/:id', function (req, res, next) {
    
});
/* DELETE /redeseguranca/:id */
router.delete('/:id', function (req, res, next) {
    
});
module.exports = router;