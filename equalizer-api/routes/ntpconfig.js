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
                var timezone = timeServer[0].timeZone;
                console.log('host SNTP a conectar: ' + nome_host + "(" + timezone + ")");
                try {
                    console.log("Configurando timezone");
                    process.env.TZ = timezone;
                    require('child_process').exec('export TZ="' + timezone + '"', (err, stdout, stderr) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        console.log('Acionando servidor');
                        require('child_process').exec('ntpdate ' + nome_host, (err, stdout, stderr) => {
                            if(err){
                                console.error(err);
                                return;
                            }
                            console.log("SNTP Atualizado com sucesso");
                            console.log(stdout);
                        });
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
    console.log("Testando servidor: " + server);
    var options = {
        host: server,  // Defaults to pool.ntp.org 
        port: 123,                      // Defaults to 123 (NTP) 
        resolveReference: false,         // Default to false (not resolving) 
        timeout: 1000                   // Defaults to zero (no timeout) 
    };
    try {
        require('child_process').exec('ntpdate ' + server, (err, stdout, stderr) =>{
            if (err) {
                res.json("Erro ao recuperar data/hora.");
                return;
            }else{
                res.json(stdout);
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
    var ano = primeiraPart.split('-')[0];
    var mes = primeiraPart.split('-')[1];
    var dia = primeiraPart.split('-')[2];
    var hora = segundaPart.split(':')[0];
    var minuto = segundaPart.split(':')[1];
    /* Recuperando o timezone */
    TimeServer.getAll(function (err, timeServer) {
        try {
            /* Configura o timezone */
            var timezone = timeServer[0].timeZone;
            process.env.TZ = timezone;
            console.log("timezone = " + timezone);
            // Flavio Alves: retirando o ajuste para UTC da hora, que estava
            // causando inconsistencia de horario com o Linux
            // var dateTime = new Date();
            // dateTime.setUTCFullYear(parseInt(ano,10));
            // dateTime.setUTCMonth(parseInt(mes,10));
            // dateTime.setUTCDate(parseInt(dia,10))
            // dateTime.setUTCHours(parseInt(hora,10));
            // dateTime.setUTCMinutes(parseInt(minuto,10));
            // console.log("datetime = " + dateTime.toUTCString());
            var dateTime = ano + "/" + mes + "/" + dia + " " + hora + ":" + minuto;
            //setup.clock.set(dateTime);
            var command_to_exec = 'date -u -s "' + dateTime + '" ; hwclock --systohc; sleep 3';
            console.log("command = " + command_to_exec);
            require('child_process').exec(command_to_exec, (err, stdout, stderr) => {
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

    

});

module.exports = router;
