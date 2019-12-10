var express = require('express');
var setup = require('setup')();
var router = express.Router();

function user_match(req, user){
    return req.user.acesso === user;
}

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated() && user_match(req, "administrador"))
        return next();
    if (req.isAuthenticated() && !user_match(req, "administrador"))
        res.redirect('/statusmoduloview');
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}
/* GET home page. */
router.get('/', isAuthenticated,  function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.render('parameterview', { title: 'Parâmetros', pageName: 'parameterview', username: req.user.nome, userAccess: req.user.acesso, userEmail: req.user.email, showHeaderData: global.showHeaderInfo, translate: res.__('parameter'), translate_header: res.__('header') });
});
router.get('/reboot', isAuthenticated,  function (req, res, next) {
    console.log("Início função reboot.");
    var exec = require('child_process').exec;
    var cmd = 'sudo reboot';
    exec(cmd, function (error, stdout, stderr) {
        if (error) {
            console.error(error);
            res.json("Erro ao reiniciar.");
            return;
        }
        console.log("efetuado");
        console.log(stdout);
        res.json("efetuado.");
    });
});
router.get('/onSNMP', isAuthenticated,  function (req, res, next) {
    console.log("Início função On SNMP.");
    var exec = require('child_process').exec;
    var cmd = '/etc/init.d/snmpd start';
    exec(cmd, function (error, stdout, stderr) {
        if (error) {
            console.error(error);
            res.send("Erro ao executar '/etc/init.d/snmpd start.");
            return;
        }
        cmd = '/etc/init.d/equalizer-traps start';
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                console.error(error);
                res.send("Erro ao executar equalizer-traps start.");
                return;
            }
            console.log("efetuado");
            console.log(stdout);
            res.send("efetuado.");
        });
    });
});
router.get('/offSNMP', isAuthenticated,  function (req, res, next) {
    console.log("Início função Off SNMP.");
    var exec = require('child_process').exec;
    var cmd = '/etc/init.d/snmpd stop';
    exec(cmd, function (error, stdout, stderr) {
        if (error) {
            console.error(error);
            res.send("Erro ao executar '/etc/init.d/snmpd stop.");
            return;
        }
        cmd = '/etc/init.d/equalizer-traps stop';
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                console.error(error);
                res.send("Erro ao executar equalizer-traps stop.");
                return;
            }
            console.log("efetuado");
            console.log(stdout);
            res.send("efetuado.");
        });
    });
});
module.exports = router;
