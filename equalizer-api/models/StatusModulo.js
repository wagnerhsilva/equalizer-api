var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var createStatusModulo = function (string, bateria, temperatura, impedancia, tensao, min_temp, max_temp, min_imp, max_imp, min_tensao, max_tensao) {
    return {
        string: string, 
        bateria: bateria, 
        temperatura: temperatura, 
        impedancia: impedancia, 
        tensao: tensao, 
        min_temp: min_temp, 
        max_temp: max_temp, 
        min_imp: min_imp, 
        max_imp: max_imp, 
        min_tensao: min_tensao, 
        max_tensao: max_tensao,
        percentualTensao: 100- (((parseFloat(tensao)/parseFloat(max_tensao)) * 100.00) > 100.00 ? 100.00 : ((parseFloat(tensao)/parseFloat(max_tensao)) * 100.00)),
        precentualMinTensao: (tensao / min_tensao * 100)
    }
}
var get = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    var strSql = ""
    strSql = strSql + "SELECT 	RVAL.STRING, ";
    strSql = strSql + "		    RVAL.BATERIA, ";
    strSql = strSql + "		    DLOG.TEMPERATURA, ";
    strSql = strSql + "		    DLOG.IMPEDANCIA, ";
    strSql = strSql + "		    DLOG.TENSAO, ";
    strSql = strSql + "		    ALAR.* ";
    strSql = strSql + "FROM ( ";
    strSql = strSql + "		    SELECT DISTINCT STRING, ";
    strSql = strSql + "						    BATERIA, ";
    strSql = strSql + "						    MAX(ID) ID ";
    strSql = strSql + " ";
    strSql = strSql + "		    FROM        DATALOG ";
    strSql = strSql + "		    GROUP BY    STRING, ";
    strSql = strSql + "				        BATERIA ";
    strSql = strSql + "		  ";
    strSql = strSql + "     ) AS 						RVAL, ";
    strSql = strSql + "			        ALARMECONFIG 	ALAR ";
    strSql = strSql + "INNER JOIN 	    DATALOG 		DLOG ON (RVAL.ID = DLOG.ID)";
    db.all(strSql, function (err, rows) {
        var statusModulos = [];
        rows.forEach(function row(row) {
            statusModulos.push(new createStatusModulo(row.STRING, row.BATERIA, row.temperatura, row.impedancia, row.tensao, row.nivel_alert_temp_min, row.nivel_alert_temp_max, row.nivel_alert_impedancia_min, row.nivel_alert_impedancia_max, row.nivel_alert_tensao_min, row.nivel_alert_tensao_max));
        });
        data(err, statusModulos);
    });
    db.close();
}
module.exports.get = get;