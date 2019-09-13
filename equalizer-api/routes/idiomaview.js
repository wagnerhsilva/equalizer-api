var express = require('express');
var router = express.Router();
var child_process = require('child_process');
var path = require('path');

// var rotuloString = require('../models/RotuloString');
// var parameters = require('../models/Parameters');

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
    res.render('idiomaview', { title: 'Configuração de idioma', pageName: 'idiomaview', username: req.user.nome, userAccess: req.user.acesso, userEmail: req.user.email, showHeaderData: global.showHeaderInfo, headerInfoCDec: global.headerInfoCDec, lastDutyMax: global.lastDutyMax, translate: res.__('idioma'), translate_header: res.__('header') });
});

module.exports = router;
