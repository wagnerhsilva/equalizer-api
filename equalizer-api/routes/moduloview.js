var express = require('express');
var router = express.Router();
var child_process = require('child_process');
var path = require('path');
var mime = require('mime');

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
    res.render('moduloview', { title: 'Configuração de módulo e alarme', pageName: 'moduloview', username: req.user.nome, userAccess: req.user.acesso, userEmail: req.user.email, showHeaderData: global.showHeaderInfo });
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
    /*var filename = path.basename(file);
    console.log(filename);
    var mimetype = "application/x-sqlite3";

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);*/
});
module.exports = router;
