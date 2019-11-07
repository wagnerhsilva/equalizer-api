var express = require('express');
var router = express.Router();

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
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.render('snmpconfigview', { title: 'Configurações de SNMP', pageName: 'snmpconfigview', username: req.user.nome, userAccess: req.user.acesso, userEmail: req.user.email, showHeaderData: global.showHeaderInfo, headerInfoCDec: global.headerInfoCDec, translate: res.__('snmpconfig'), translate_header: res.__('header') });
});
router.get('/showHideHeaderInfo', function (req, res, next) {
    if (global.showHeaderInfo)
        global.showHeaderInfo = false;
    else
        global.showHeaderInfo = true;
    console.log("ShowHideHeaderInfo = " + global.showHeaderInfo);
});

module.exports = router;
