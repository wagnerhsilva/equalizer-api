var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var createAlarmLog = function (id, dataHora, descricao) {
    return {
        id: id,
        dataHora: dataHora,
        descricao: descricao
    }
}
var save = function (alarmLog, err) {
    var db = new sqlite3.Database('equalizerdb');
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
    db.all("SELECT id, dataHora, descricao FROM AlarmLog ORDER BY id desc", function (err, rows) {
        var alarmLogs = [];
        rows.forEach(function row(row) {
            alarmLogs.push(new createAlarmLog(row.id, new Date(row.dataHora), row.descricao));
        });
        data(err, alarmLogs);
    });
    db.close();
}
var getLast = function (id, data) {
    var db = new sqlite3.Database('equalizerdb');
    db.get("SELECT id, dataHora,descricao FROM AlarmLog ORDER BY id DESC LIMIT 1", function (err, row) {
        if (row) {
            var alarmLog = new createAlarmLog(row.id, new Date(row.dataHora), row.descricao);
            console.log(alarmLog);
            data(err, alarmLog);
        }
        else
            data(err, null);
    });
    db.close();
}
module.exports.save = save;
module.exports.createAlarmLog = createAlarmLog;
module.exports.getAll = getAll;
module.exports.getLast = getLast;