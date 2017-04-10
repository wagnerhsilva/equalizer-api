var express = require('express');
var router = express.Router();
var Usuario = require('../models/Usuario');
var RedeSeguranca = require('../models/RedeSeguranca');
var getMac = require('getmac');
var ip = require('ip');
var network = require('network');
var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}
/* GET home page. */
router.get('/', isAuthenticated, function (req, res, next) {
    network.get_active_interface(function (err, obj) {
        /* obj should be:
       
        { name: 'eth0',
          ip_address: '10.0.1.3',
          mac_address: '56:e5:f9:e4:38:1d',
          type: 'Wired',
          netmask: '255.255.255.0',
          gateway_ip: '10.0.1.1' }
       
        */
        RedeSeguranca.getAll(function (err, redeSeguranca) {
            console.log(redeSeguranca.length);
            Usuario.getAll(function (err, usuarios) {
                if (err) return next(err);
                res.render('redesegurancaview', { title: 'Rede & Segurança', pageName: 'redesegurancaview', username: req.user.nome, userAccess: req.user.acesso, usuarios: usuarios, network: obj, redeSeguranca: redeSeguranca });
            });
        });
    })
});
router.post('/', function (req, res, next) {
    console.log(req.body);
    RedeSeguranca.getAll(function (err, redeSeguranca) {
        if (redeSeguranca.length > 0) {
            RedeSeguranca.update(req.body);
            res.redirect("redesegurancaview");
        } else {
            RedeSeguranca.save(req.body);
            res.redirect("redesegurancaview");
        }
    });
});

module.exports = router;
