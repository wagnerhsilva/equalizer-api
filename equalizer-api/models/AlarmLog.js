var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var createAlarmLog = function (id, dataHora, descricao, nOcorrencias) {
    return {
        id: id,
        dataHora: dataHora,
        descricao: descricao,
        emailEnviado: 0,
        nOcorrencias: nOcorrencias
    }
}
var createAlarmLogCalendar = function (Data, Ocorrencias) {
    return {
        Data: Data,
        Ocorrencias: Ocorrencias
    }
}
var save = function (alarmLog, err) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    var stmt = db.prepare("INSERT INTO AlarmLog(dataHora, descricao) VALUES (?,?)");
    stmt.run(dataLog.dataHora, dataLog.descricao, function (error) {
        if (error)
            err(error);
        else
            err(false);
    });
    stmt.finalize();
    db.close();
}
var getAll = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.all("SELECT id, dataHora, descricao, n_ocorrencias FROM AlarmLog ORDER BY id desc limit 500", function (err, rows) {
        var alarmLogs = [];
        rows.forEach(function row(row) {
            alarmLogs.push(new createAlarmLog(row.id, new Date(row.dataHora), row.descricao, row.n_ocorrencias));
        });
        data(err, alarmLogs);
    });
    db.close();
}
var getForCalendar = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.all("SELECT STRFTIME('%Y-%m-%d', dataHora) Data, SUM(n_ocorrencias) Ocorrencias FROM ALARMLOG GROUP BY STRFTIME('%Y-%m-%d', dataHora)", function (err, rows) {
            var alarmLogs = [];
            rows.forEach(function row(row) {
                console.log(row);
                alarmLogs.push(new createAlarmLogCalendar(row.Data, row.Ocorrencias));
            });
            data(err, alarmLogs);
        });
    db.close();
}
var getLast = function (id, data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.get("SELECT id, dataHora,descricao, n_ocorrencias FROM AlarmLog ORDER BY id DESC LIMIT 1", function (err, row) {
        if (row) {
            var alarmLog = new createAlarmLog(row.id, new Date(row.dataHora), row.descricao, row.n_ocorrencias);
            console.log(alarmLog);
            data(err, alarmLog);
        }
        else
            data(err, null);
    });
    db.close();
}
var getEnviaEmail = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.all("SELECT count(*) conta FROM AlarmLog where emailEnviado = 0", function (err, rows) {
        var conta = 0;
        rows.forEach(function row(row) {
            conta = row.conta;
        });
        data(err, conta);
    });
    db.close();
}
var updateEnviaEmail = function () {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.run("UPDATE AlarmLog set emailEnviado = 1 where emailEnviado = 0");
    db.close();
}
module.exports.save = save;
module.exports.createAlarmLog = createAlarmLog;
module.exports.getAll = getAll;
module.exports.getLast = getLast;
module.exports.getEnviaEmail = getEnviaEmail;
module.exports.updateEnviaEmail = updateEnviaEmail;
module.exports.getForCalendar = getForCalendar;
