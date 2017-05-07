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
        try {
            var exec = require('child_process').exec;
            var cmd = 'sudo ntpdate -u ' + timeServer[0].timeServerAddress1;
            setInterval(updateDate, 1000 * 60 * 60 * 24); // atualizar uma vez por dia
            function updateDate() {
                exec(cmd, function (error, stdout, stderr) {
                    if (err) {
                        console.error(err);
                        res.json("Erro ao definir ntp server.");
                        return;
                    }
                    console.log("efetuado");
                    console.log(stdout);
                    res.json("efetuado.");
                });
            }
            updateDate();
        } catch (ex) {
            res.json("Erro ao definir ntp server.");
            console.log(ex);
            console.log("Erro ao definir ntp server.");
            console.log(ex);
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
        console.log("Erro ao recuperar data/hora.");
        console.log(ex);
        return;
    }
});
router.get('/manual/:dateTime', function (req, res, next) {
    var dateTimeSemFormato = req.params.dateTime;
    var primeiraPart = dateTimeSemFormato.split(' ')[0];
    var segundaPart = dateTimeSemFormato.split(' ')[1];
    var ano = primeiraPart.split('-')[2];
    var mes = primeiraPart.split('-')[1];
    var dia = primeiraPart.split('-')[0];
    var hora = segundaPart.split(':')[0];
    var minuto = segundaPart.split(':')[1];
    var dateTime = new Date(Date.UTC(ano, mes - 1, dia, hora, minuto));
    console.log(dateTime);
    try {
        console.log(dateTime);
        //setup.clock.set(dateTime);
        require('child_process').exec('sudo date -s "' + dateTime + '" ; hwclock --systohc;', (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("efetuado");
            console.log(stdout);
        });
    } catch (ex) {
        console.log("Erro ao recuperar data/hora.");
        console.log(ex);
        res.json("Erro ao definir data/hora.");
        return;
    }
    res.json(dateTime);

});
Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}
Date.prototype.removeHours = function (h) {
    this.setHours(this.getHours() - h);
    return this;
}
module.exports = router;
