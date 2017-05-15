var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var createDataLog = function (id, dataHora, string, bateria, temperatura, impedancia, tensao, equalizacao) {
    return {
        id: id,
        dataHora: dataHora,
        string: string,
        bateria: bateria,
        temperatura: (temperatura / 10).toFixed(1),
        impedancia: (impedancia / 100).toFixed(1),
        tensao: (tensao / 1000).toFixed(3),
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
    db.all("SELECT id, dataHora, string, bateria, temperatura, impedancia, tensao, equalizacao FROM DataLog ORDER BY id, string, bateria DESC limit 500", function (err, rows) {
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
    strSql += "						SELECT 	DATALOG.STRING, ";
    strSql += "								DATALOG.BATERIA, ";
    strSql += "								MAX(DATALOG.ID) ULTIMO_ID ";
    strSql += "						FROM DATALOG, MODULO ";
    strSql = strSql + "		    WHERE 	CAST(SUBSTR(DATALOG.BATERIA, 2, length(DATALOG.BATERIA)) as integer) <= MODULO.N_BATERIAS_POR_STRINGS ";
    strSql = strSql + "		    AND		CAST(SUBSTR(DATALOG.STRING, 2, length(DATALOG.STRING)) as integer) <= MODULO.N_STRINGS ";
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
    var countDataLog = 0;
    var countAlarmLog = 0;
    db.run('PRAGMA busy_timeout = 10000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.get("select (0.00 + count(distinct d.id)) * 100.00 as descargas from datalog d", function (err, row) {
        if (row) {
            countDataLog = row.descargas;
            db.get("select (0.00 + count(distinct a.id)) * 100.00 as descargas from alarmlog a", function (err, row2) {
                if (row2) {
                    countAlarmLog = row.descargas;
                    data(err, (countAlarmLog / countDataLog * 100));
                } else
                    data(err, null);
            });
        }
        else
            data(err, null);
    });
    db.close();
}
var getAvgLast = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.get("SELECT AVG_LAST\n" +
        ", param1\n" +
        "FROM PARAMETERS WHERE ID IN (\n" +
        "SELECT MAX(ID)\n" +
        "FROM PARAMETERS\n" +
        ")", function (err, row) {
            if (row) {
                var avgLast = { avg: parseFloat(row.avg_last), soma: parseFloat(row.param1) };
                console.log("avgLast: ");
                console.log(avgLast);
                data(err, avgLast);
            }
            else
                data(err, null);
        });
    db.close();
}
var logInsert = function (data) {
    console.log("inserting datalog");
    var db = new sqlite3.Database('equalizerdb');


    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S1', 'M1', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S2', 'M1', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S3', 'M1', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S4', 'M1', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S5', 'M1', 100, 100, 15000, 6000);");

    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S1', 'M2', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S2', 'M2', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S3', 'M2', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S4', 'M2', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S5', 'M2', 100, 100, 15000, 6000);");

    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S1', 'M3', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S2', 'M3', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S3', 'M3', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S4', 'M3', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S5', 'M3', 100, 100, 15000, 6000);");

    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S1', 'M4', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S2', 'M4', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S3', 'M4', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S4', 'M4', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S5', 'M4', 100, 100, 15000, 6000);");

    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S1', 'M5', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S2', 'M5', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S3', 'M5', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S4', 'M5', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S5', 'M5', 100, 100, 15000, 6000);");

    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S1', 'M6', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S2', 'M6', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S3', 'M6', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S4', 'M6', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S5', 'M6', 100, 100, 15000, 6000);");

    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S1', 'M7', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S2', 'M7', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S3', 'M7', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S4', 'M7', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S5', 'M7', 100, 100, 15000, 6000);");

    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S1', 'M8', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S2', 'M8', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S3', 'M8', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S4', 'M8', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S5', 'M8', 100, 100, 15000, 6000);");

    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S1', 'M9', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S2', 'M9', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S3', 'M9', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S4', 'M9', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S5', 'M9', 100, 100, 15000, 6000);");

    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S1', 'M10', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S2', 'M10', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S3', 'M10', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S4', 'M10', 100, 100, 15000, 6000);");
    db.run("INSERT INTO DATALOG (DATAHORA, STRING, BATERIA, TEMPERATURA, IMPEDANCIA, TENSAO, EQUALIZACAO) VALUES('2017-05-10 21:16', 'S5', 'M10', 100, 100, 15000, 6000);");
}
module.exports.save = save;
module.exports.logInsert = logInsert;
module.exports.createDataLog = createDataLog;
module.exports.getAll = getAll;
module.exports.getLast = getLast;
module.exports.getSomaTensao = getSomaTensao;
module.exports.getPercentualDescarga = getPercentualDescarga;
module.exports.getAvgLast = getAvgLast;