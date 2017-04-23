var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var createDataLog = function (id, dataHora, string, bateria, temperatura, impedancia, tensao, equalizacao) {
    return {
        id: id,
        dataHora: dataHora,
        string: string,
        bateria: bateria,
        temperatura: temperatura,
        impedancia: impedancia,
        tensao: tensao,
        equalizacao: equalizacao
    }
}
var save = function (dataLog, err) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000;');
    db.run('PRAGMA journal_mode=WAL;');
    var stmt = db.prepare("INSERT INTO DataLog(dataHora, string, bateria, temperatura, impedancia, tensao, equalizacao) VALUES (?,?,?,?,?,?,?)");
    stmt.run(dataLog.dataHora, dataLog.string, dataLog.bateria, dataLog.temperatura, dataLog.impedancia, dataLog.tensao, function (error) {
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
    db.run('PRAGMA busy_timeout = 10000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.all("SELECT id, dataHora, string, bateria, temperatura, impedancia, tensao, equalizacao FROM DataLog ORDER BY id, string, bateria DESC", function (err, rows) {
        var dataLogs = [];
        rows.forEach(function row(row) {
            dataLogs.push(new createDataLog(row.id, row.dataHora, row.string, row.bateria, row.temperatura, row.impedancia, row.tensao, row.equalizacao));
        });
        data(err, dataLogs);
    });
    db.close();
}
var getLast = function (id, data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.get("SELECT id, dataHora, string, bateria, temperatura, impedancia, tensao, equalizacao FROM DataLog ORDER BY id DESC LIMIT 1", function (err, row) {
        if (row) {
            var dataLog = new createDataLog(row.id, row.dataHora, row.string, row.bateria, row.temperatura, row.impedancia, row.tensao, row.equalizacao);
            console.log(dataLog);
            data(err, dataLog);
        }
        else
            data(err, null);
    });
    db.close();
}
var getSomaTensao = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000;');
    db.run('PRAGMA journal_mode=WAL;');
    var strSql = "";
    strSql += "SELECT SUM(TENSAO) soma ";
    strSql += "FROM DATALOG ";
    strSql += "WHERE ID IN ( ";
    strSql += "				SELECT ULTIMO_ID ";
    strSql += "				FROM ( ";
    strSql += "						SELECT 	STRING, ";
    strSql += "								BATERIA, ";
    strSql += "								MAX(ID) ULTIMO_ID ";
    strSql += "						FROM DATALOG ";
    strSql += "						GROUP BY 	STRING, ";
    strSql += "									BATERIA ";
    strSql += "					) AS X ";
    strSql += "			)";
    console.log(strSql);
    db.get(strSql, function (err, row) {
        if (row) {
            var soma = row.soma;
            console.log(soma);
            data(err, soma);
        }
        else
            data(err, null);
    });
    db.close();
}
var getPercentualDescarga = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.get("select (0.00 + count(distinct a.id)) / (0.00 + count(distinct d.id)) * 100.00 as descargas from datalog d, alarmlog a", function (err, row) {
        if (row) {
            var descargas = row.descargas;
            console.log(descargas);
            data(err, descargas);
        }
        else
            data(err, null);
    });
    db.close();
}
module.exports.save = save;
module.exports.createDataLog = createDataLog;
module.exports.getAll = getAll;
module.exports.getLast = getLast;
module.exports.getSomaTensao = getSomaTensao;
module.exports.getPercentualDescarga = getPercentualDescarga;