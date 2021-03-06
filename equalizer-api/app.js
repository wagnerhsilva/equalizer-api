/*
 * Componentes
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
var i18n = require('./i18n');
var equalizerdb = require('./database/equalizerdb');
var emailServerModel = require('./models/EmailServer.js');

/*
 * Rotas
 */
var index = require('./routes/index')(passport);
var home = require('./routes/home');
var snmpconfig = require('./routes/snmpconfig');
var snmpconfigview = require('./routes/snmpconfigview');
var horaservidor = require('./routes/horaservidor');
var usuarios = require('./routes/usuarios');
var modulo = require('./routes/modulo');
var tendence = require('./routes/tendence');
var parameter = require('./routes/parameter');
var tendencias = require('./routes/tendencias');
var tendanalitics = require('./routes/tendanalitics');
var statusmodulo = require('./routes/statusmodulo');
var chart = require('./routes/chart');
var chart2 = require('./routes/chart2');
var alarmeConfig = require('./routes/alarmeConfig');
var dataLog = require('./routes/dataLog');
var ntpconfig = require('./routes/ntpconfig');
var enviaEmail = require('./routes/enviarEmail');
var bacsstatus = require('./routes/bacsstatus');
var redeseguranca = require('./routes/redeseguranca');
var alarmlog = require('./routes/alarmlog');
var timeserver = require('./routes/timeserver');
var emailserver = require('./routes/emailserver');
var livefeeds = require('./routes/livefeed');
var headerData = require('./routes/getHeaderData');
var usuarioview = require('./routes/usuarioview');
var moduloview = require('./routes/moduloview');
var parameterview = require('./routes/parameterview');
var tendenciasview = require('./routes/tendenciasview');
var tendanaliticsview = require('./routes/tendanaliticsview');
var dataLogView = require('./routes/dataLogView');
var bacsstatusview = require('./routes/bacsstatusview');
var redesegurancaview = require('./routes/redesegurancaview');
var alarmlogview = require('./routes/alarmlogview');
var timeserverview = require('./routes/timeserverview');
var emailserverview = require('./routes/emailserverview');
var statusmoduloview = require('./routes/statusmoduloview');
var livefeedsview = require('./routes/livefeedview');
var chartview = require('./routes/chartview');
var chart2view = require('./routes/chart2view');
var idiomaview = require('./routes/idiomaview');
var idioma = require('./routes/idioma');

/*
 * Modelos
 */
var dataLogDB = require('./models/DataLog');
var snmpmodel = require('./models/SnmpConfig');
var TimeServer = require('./models/TimeServer');

console.log("Iniciando SNTP");
setInterval(updateDate, 1000 * 60 * 60); // atualizar uma vez por hora
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
                require('child_process').exec('ntpdate ' + nome_host, (err, stdout, stderr) => {
                    if(err){
                        console.error(err);
                        return;
                    }
                    console.log("SNTP Atualizado com sucesso");
                    console.log(stdout);
                });
                
                } catch (ex) {
                    console.log(ex);
                    console.log("Erro ao comunicar com servidor NTP");
                    console.log(ex);
                    return;
                }
            //}
    });
};
updateDate();

// Flavio Alves: configurando o timezone do projeto para o Brasil,
// com o intuito de evitar divergencias na coleta de data e hora
// do sistema

console.log("Iniciando Timezone");
TimeServer.getTimezone(function(err, tz) {
    console.log("Timezone configurado: " + tz);
    if (tz != null) {
        process.env.TZ = tz;
    } else {
        process.env.TZ = 'America/Sao_Paulo';
    }
    console.log('Configurando variavel de ambiente do fuso horario');
    require('child_process').exec('export TZ="' + tz + '"', (err, stdout, stderr) => {
        if(err){
            console.error(err);
            return;
        }
    });
});

/*
 * Inicializando Banco de Dados
 */

equalizerdb.init();

/*
 * Inicializando serviço SNMP
 */
console.log("Initing SNMP");
snmpmodel.init_snmp();

/*
 * Inicializando framework express
 */
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({ secret: 'minhaChaveSecreta' }));
// Configuring Passport
app.use(passport.initialize());
app.use(passport.session());

/*
 * Inicializando a localização
 */
app.use(i18n);

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

app.use('/', index);
app.use('/home', home);
app.use('/horaservidor', horaservidor);
app.use('/usuarios', usuarios);
app.use('/modulo', modulo);
app.use('/tendence', tendence);
app.use('/parameter', parameter);
app.use('/tendencias', tendencias);
app.use('/tendanalitics', tendanalitics);
app.use('/tendanaliticsview', tendanaliticsview);
app.use('/statusmodulo', statusmodulo);
app.use('/dataLog', dataLog);
app.use('/snmpconfig', snmpconfig);
app.use('/snmpconfigview', snmpconfigview);
app.use('/alarmeConfig', alarmeConfig);
app.use('/livefeed', livefeeds);
app.use('/getheaderdata', headerData);
app.use('/bacsstatus', bacsstatus);
app.use('/ntpconfig', ntpconfig);
app.use('/redeseguranca', redeseguranca);
app.use('/enviarEmail', enviaEmail);
app.use('/alarmlog', alarmlog);
app.use('/timeserver', timeserver);
app.use('/emailserver', emailserver);
app.use('/chart', chart);
app.use('/chart2', chart2);
app.use('/usuarioview', usuarioview);
app.use('/moduloview', moduloview);
app.use('/parameterview', parameterview);
app.use('/tendenciasview', tendenciasview);
app.use('/dataLogView', dataLogView);
app.use('/bacsstatusview', bacsstatusview);
app.use('/redesegurancaview', redesegurancaview);
app.use('/alarmlogview', alarmlogview);
app.use('/timeserverview', timeserverview);
app.use('/emailserverview', emailserverview);
app.use('/statusmoduloview', statusmoduloview);
app.use('/livefeedview', livefeedsview);
app.use('/chartview', chartview);
app.use('/chart2view', chart2view);
app.use('/idioma', idioma);
app.use('/idiomaview', idiomaview);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/*
 * Configurando intervalo para envio de email
 */
setInterval(function(){ emailServerModel.sendEmail(); }, 30000);


module.exports = app;
global.showHeaderInfo = true;
global.headerInfoCDec = 3;
global.lastDutyMax = 0;
global.checkcurrent = false;
