var express = require('express');
var router = express.Router();
var TimeServer = require('../models/TimeServer');

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
    TimeServer.getAll(function (err, timeServer) {
        var _timezone = timeServer[0].timeZone;
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.render('timeserverview', 
                { title: 'TimeServer Settings', 
                  pageName: 'timeserverview', 
                  username: req.user.nome, 
                  userAccess: req.user.acesso, 
                  userEmail: req.user.email, 
                  serverDate: new Date(), 
                  showHeaderData: global.showHeaderInfo, 
                  translate: res.__('timeserver'), 
                  translate_header: res.__('header'), 
                  timezone: _timezone 
                }
        );
    });
    
});

module.exports = router;
