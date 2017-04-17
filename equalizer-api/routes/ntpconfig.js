var express = require('express');
var router = express.Router();
var Sntp = require('sntp');
var TimeServer = require('../models/TimeServer');
var setup = require('setup')();
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
        var server = req.params.server;
        var options = {
            host: timeServer[0].timeServerAddress1,  // Defaults to pool.ntp.org 
            port: 123,                      // Defaults to 123 (NTP) 
            resolveReference: true,         // Default to false (not resolving) 
            timeout: 1000                   // Defaults to zero (no timeout) 
        };
        try {
            Sntp.time(options, function (err, time) {
                if (err) {
                    res.json("Erro ao recuperar data/hora.");
                    return;
                }
                if (time == null) {
                    res.json("Erro ao recuperar data/hora.");
                    return;
                } else {
                    console.log("setting time");
                    setup.clock.set(new Date(time.referenceTimestamp));
                    res.json(new Date(time.referenceTimestamp));
                    return;
                }
            });
        } catch (ex) {
            res.json("Erro ao recuperar data/hora.");
            return;
        }

    });
});
router.get('/test/:server', function (req, res, next) {
    var server = req.params.server;
    var options = {
        host: server,  // Defaults to pool.ntp.org 
        port: 123,                      // Defaults to 123 (NTP) 
        resolveReference: false,         // Default to false (not resolving) 
        timeout: 1000                   // Defaults to zero (no timeout) 
    };
    try {
        Sntp.time(options, function (err, time) {
            if (err) {
                res.json("Erro ao recuperar data/hora.");
                return;
            }
            if (time == null) {
                res.json("Erro ao recuperar data/hora.");
                return;
            } else {
                res.json(new Date(time.referenceTimestamp));
                console.log('Local clock is off by: ' + time.t + ' milliseconds');
                return;
            }
        });
    } catch (ex) {
        res.json("Erro ao recuperar data/hora.");
        return;
    }
});
module.exports = router;
