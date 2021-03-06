var express = require('express');
var router = express.Router();
var child_process = require('child_process');
var path = require('path');
var rotuloString = require('../models/RotuloString');
var parameters = require('../models/Parameters');
var User = require('../models/Usuario');

var noAuthRequired = function (req, res, next) {
    return next();
}

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
    res.render('moduloview', { title: 'Configuração de módulo e alarme', pageName: 'moduloview', username: req.user.nome, userAccess: req.user.acesso, userEmail: req.user.email, showHeaderData: global.showHeaderInfo, headerInfoCDec: global.headerInfoCDec, lastDutyMax: global.lastDutyMax, translate: res.__('modulo'), translate_header: res.__('header') });
    console.log("Elielder");
    parameters.getLast(function (err, parameter) {
        if(parameter.CheckboxCurrent=='1'){
            global.checkcurrent = true;
        }else if(parameter.CheckboxCurrent=='0'){
            global.checkcurrent = false;
        }
    });
    console.log(global.checkcurrent);
});
router.get('/showHideHeaderInfo', function (req, res, next) {
    if (global.showHeaderInfo)
        global.showHeaderInfo = false;
    else
        global.showHeaderInfo = true;
    console.log("ShowHideHeaderInfo = " + global.showHeaderInfo);
});
router.get('/clearDb', function (req, res, next) {
      child_process.exec('sh /var/www/equalizer-api/delete_logs.sh', (err, stdout, stderr) => {
          if (err) { 
              console.error(err);                                               
              return;                                                           
          }                                                                     
          console.log("Script delecao de logs executado");                      
      });
//    var sqlite3 = require('sqlite3').verbose();
//    var db = new sqlite3.Database('equalizerdb');
//    db.run('PRAGMA busy_timeout = 60000;');
//    db.run('PRAGMA journal_mode=WAL;');
//    db.run('DELETE FROM DataLog;');
//    db.run('DELETE FROM AlarmLog;');
//    db.run('VACUUM;');
//    console.log("DB cleared");
});
router.get('/clearLog', function (req, res, next) {
    child_process.exec('rm -r /var/www/serial_service/debug.txt; rm -r /var/www/equalizer-api/equalizer-api/debug_web.txt;', (err, stdout, stderr) => {
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
});
router.get('/downloadDB/:username/:password', noAuthRequired, function (req, res) {
    var user = req.params.username
    var password = req.params.password
    console.log("downloadDB com autenticacao");

    User.getPassword(user,
        function(err,passwd) {
            if(err) {
                console.log("Erro na captura da senha");
                res.redirect('/');
            } else {
                if (passwd == password) {
                    console.log("Senha validada. Entregando banco");
                    var file = path.join(__dirname, '..', 'equalizerdb');
                    console.log(file);
                    res.download(file);
                } else {
                    console.log("Senha invalida: " + passwd + " (" + password + "0");
                    res.redirect('/');
                }
            }
        }
    );
});
router.post('/gravarRotuloString', isAuthenticated, function (req, res) {
    console.log("gravarRotuloString");
    var rotuloStringPost = req.body;
    console.log(rotuloStringPost);
    rotuloString.getByString(rotuloStringPost.string, function (data) {
        if (data != null) {
            rotuloString.update(rotuloStringPost);
        } else {
            rotuloString.save(rotuloStringPost);
        }
    });
    res.send("Rótulo definido com sucesso!");
});
router.get('/rotuloString/:string', isAuthenticated, function (req, res) {
    var string = req.params.string;
    console.log("rotuloString");
    console.log(string);
    rotuloString.getByString(string, function (data) {
        if (data != null) {
            res.send(data.apelido);
        } else {
            res.send("");
        }
    });
});
router.get('/rotuloStringObj/:string', isAuthenticated, function (req, res) {
    var string = req.params.string;
    console.log("rotuloString");
    console.log(string);
    rotuloString.getByString(string, function (data) {
        if (data != null) {
            res.send(data);
        } else {
            res.send(req.params.string);
        }
    });
});
router.get('/changeCasasDecHeader/:casas', isAuthenticated, function (req, res) {
    var casas = req.params.casas;
    global.headerInfoCDec = parseInt(casas);
    res.send("Casas decimais redefinidas.");
});
router.get('/zerarDutyMax', isAuthenticated, function (req, res) {
    parameters.getLast(function (err, parameter) {
        global.lastDutyMax = parameter.duty_max;
    });
    setTimeout(function () { parameters.zerarDutyMax(); }, 2000);
    res.send("Equalização desligada.");
});
router.get('/voltarDutyMax', isAuthenticated, function (req, res) {
    parameters.voltarDutyMax();
    global.lastDutyMax = 0;
    res.send("Equalização reconfigurada.");
});
router.post('/Read/HabilitaCorrente', isAuthenticated, function (req, res) {
    global.checkcurrent = true;
    parameters.HabilitaCorrente();    
    res.send("Leitura de Corrente Habilitada.");
});
router.post('/Read/ReabilitaCorrente', isAuthenticated, function (req, res) {
    global.checkcurrent = false;
    parameters.ReabilitaCorrente();
    res.send("Leitura de Corrente Desabilitada.");
});
router.post('/callImp', isAuthenticated, function (req, res) {
    parameters.HabLeituraImp();
    res.send("Leitura de Impedância");
});
module.exports = router;
