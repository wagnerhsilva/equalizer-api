var express = require('express');
var setup = require('setup')();
var router = express.Router();
var tendence = require('../models/Tendence');

function user_match(req, user){
    return req.user.acesso === user;
}

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
router.get('/', isAuthenticated,  function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.render('tendenciasview', { title: 'Tendências', pageName: 'tendenciasview', username: req.user.nome, userAccess: req.user.acesso, userEmail: req.user.email, showHeaderData: global.showHeaderInfo, translate: res.__('tendencias'), translate_header: res.__('header') });
});

router.get('/clearDb', function (req, res, next) {
    console.log("Entrei cleardb tendencias");
    tendence.clear(function(err) {
        console.log("Erro ao apagar dados de tendencias");
    });
    console.log("Dados removidos com sucesso");
    
//    var sqlite3 = require('sqlite3').verbose();
//    var db = new sqlite3.Database('equalizerdb');
//    db.run('PRAGMA busy_timeout = 60000;');
//    db.run('PRAGMA journal_mode=WAL;');
//    db.run('DELETE FROM Tendencias;');
//    db.run('VACUUM;');
//    console.log("DB cleared");

});

module.exports = router;
