var express = require('express');
var router = express.Router();
var Sntp = require('sntp-node');
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
/*
router.get('/', isAuthenticated, function (req, res, next) {
    TimeServer.getAll(function (err, timeServer) {
        try {
            var exec = require('child_process').exec;
            // Flavio Alves: observando este funcionamento
            console.log('Chamando ntpd: ' + timeServer[0].timeServerAddress1);
            var cmd = 'sudo ntpd -q -g -x ' + timeServer[0].timeServerAddress1;
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
*/

router.get('/', isAuthenticated, function (req, res, next) {
    setInterval(updateDate, 1000 * 60 * 60 * 24); // atualizar uma vez por dia
    function updateDate() {
        TimeServer.getAll(function (err, timeServer) {
            // Tenta um servidor NTP por vez. Em caso de erro, parte para o proximo
            var i = 0;
            //while (i < 3) {
                console.log('Inicializando SNTP');
                var nome_host = ''
                // Determina qual sera o endereco da vez
                if (i == 0) {
                    nome_host = timeServer[0].timeServerAddress1;
                } else if (i == 1) {
                    nome_host = timeServer[0].timeServerAddress2;
                } else if (i == 2) {
                    nome_host = timeServer[0].timeServerAddress3;
                }
                console.log('host SNTP a conectar: ' + nome_host);
                var options = {
                    host: nome_host,  // Defaults to pool.ntp.org 
                    port: 123,                      // Defaults to 123 (NTP) 
                    resolveReference: false,         // Default to false (not resolving) 
                    timeout: 1000                   // Defaults to zero (no timeout) 
                };
                try {
                    console.log('Acionando servidor');
                    Sntp.time(options, function (err, time) {
                        if (err) {
                            console.log("Erro ao executar modulo SNTP:" + err);
                            if (i >= 2) {
                                return;
                            } else {
                                i++;
                            }
                        } else if (time == null) {
                            console.log("Data e hora captura invalida");
                            if (i >= 2) {
                                return;
                            } else {
                                i++;
                            }
                        } else {
                            try {
                                console.log('Chamando funcao local.');
                                require('child_process').exec('date -s "' + new Date(time.referenceTimestamp) + '" ; TZ="America/SaoPaulo" hwclock --systz; hwclock --systohc;', (err, stdout, stderr) => {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }
                                    console.log("SNTP Atualizado com sucesso");
                                    console.log(stdout);
                                    console.log('Nova data/hora: ' + new Date(time.referenceTimestamp));
                                    i = 3; // forca a sair do for, caso haja sucesso com um intermediario
                                    return;
                                });
                            } catch (ex) {
                                res.json("Erro ao atualizar a hora");
                                console.log("Erro ao atualizar a hora.");
                                console.log(ex);
                                if (i >= 2) {
                                    return;
                                } else {
                                    i++;
                                }
                            }
                        }
                    }); 
                } catch (ex) {
                    res.json("Erro ao comunicar com servidor NTP");
                    console.log(ex);
                    console.log("Erro ao comunicar com servidor NTP");
                    console.log(ex);
                    return;
                }
            //}
            res.json("Efetuado.");
        });
    };
    updateDate();
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
                console.log('Resultado:' + time);
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
    // Flavio Alves: retirando o ajuste para UTC da hora, que estava
    // causando inconsistencia de horario com o Linux
    var dateTime = new Date(ano, mes - 1, dia, hora, minuto);
    console.log(dateTime);
    try {
        console.log(dateTime);
        //setup.clock.set(dateTime);
        require('child_process').exec('date -s "' + dateTime + '" ; TZ="America/SaoPaulo" hwclock --systz; hwclock --systohc;', (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("efetuado");
            console.log(stdout);
            res.json(stdout);
        });
    } catch (ex) {
        console.log("Erro ao recuperar data/hora.");
        console.log(ex);
        res.json("Erro ao definir data/hora.");
        return;
    }

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
