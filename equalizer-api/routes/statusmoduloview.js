var express = require('express');
var router = express.Router();
var modulos = require('../models/Modulo');

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
    modulos.get_acc(function (err, acc_data) {
        res.render('statusmoduloview', 
            { title: 'Status dos Módulos', 
                pageName: 'statusmoduloview', 
                username: req.user.nome, 
                userAccess: req.user.acesso, 
                userEmail: req.user.email, 
                showHeaderData: global.showHeaderInfo, 
                translate: res.__('statusmodulo'), 
                translate_header: res.__('header'),
                acc_data: acc_data
            }
        );
    });
    
});
module.exports = router;
