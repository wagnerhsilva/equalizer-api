var express = require('express');
var router = express.Router();
var child_process = require('child_process');
var path = require('path');
var rotuloString = require('../models/RotuloString');

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
    res.render('moduloview', { title: 'Configuração de módulo e alarme', pageName: 'moduloview', username: req.user.nome, userAccess: req.user.acesso, userEmail: req.user.email, showHeaderData: global.showHeaderInfo, headerInfoCDec: global.headerInfoCDec });
});
router.get('/showHideHeaderInfo', function (req, res, next) {
    if (global.showHeaderInfo)
        global.showHeaderInfo = false;
    else
        global.showHeaderInfo = true;
    console.log("ShowHideHeaderInfo = " + global.showHeaderInfo);
});
router.get('/clearDb', function (req, res, next) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.run('DELETE FROM DataLog;');
    db.run('DELETE FROM AlarmLog;');
    db.run('VACUUM;');
    console.log("DB cleared");
});
router.get('/clearLog', function (req, res, next) {
    child_process.exec('rm -r debug.txt;', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("efetuado");
        console.log(stdout);
    });
    console.log("Log cleared");
});
router.get('/downloadDB', isAuthenticated, function (req, res) {
    console.log("downloadDB");
    var file = path.join(__dirname, '..', 'equalizerdb');
    console.log(file);
    res.download(file);
});
router.post('/gravarRotuloString', isAuthenticated, function (req, res) {
    console.log("gravarRotuloString");
    var rotuloStringPost = req.body;
    console.log(rotuloStringPost);
    rotuloString.getByString(rotuloStringPost.string, function (data) {
        if (data != null) {
            rotuloString.update(rotuloStringPost);
        } else {
            rotuloString.save(rotuloStringPost);
        }
    });
    res.send("Rótulo definido com sucesso!");
});
router.get('/rotuloString/:string', isAuthenticated, function (req, res) {
    var string = req.params.string;
    console.log("rotuloString");
    console.log(string);
    rotuloString.getByString(string, function (data) {
        if (data != null) {
            res.send(data.apelido);
        } else {
            res.send("");
        }
    });
});
router.get('/rotuloStringObj/:string', isAuthenticated, function (req, res) {
    var string = req.params.string;
    console.log("rotuloString");
    console.log(string);
    rotuloString.getByString(string, function (data) {
        if (data != null) {
            res.send(data);
        } else {
            res.send(req.params.string);
        }
    });
});
router.get('/changeCasasDecHeader/:casas', isAuthenticated, function (req, res) {
    var casas = req.params.casas;
    global.headerInfoCDec = parseInt(casas);
    res.send("Casas decimais redefinidas.");
});
module.exports = router;
