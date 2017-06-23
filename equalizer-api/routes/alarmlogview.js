var express = require('express');
var router = express.Router();
var AlarmLog = require('../models/AlarmLog');
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
    res.render('alarmlogview', { title: 'AlarmLog', pageName: 'alarmlogview', username: req.user.nome, userAccess: req.user.acesso, userEmail: req.user.email, showHeaderData: global.showHeaderInfo });
});
router.get('/getForCalendar', isAuthenticated, function (req, res) {
    console.log("getForCalendar");
    AlarmLog.getForCalendar(function (err, alarmLogs) {
        console.log(alarmLogs);
        res.send(alarmLogs);
    });
});
module.exports = router;
