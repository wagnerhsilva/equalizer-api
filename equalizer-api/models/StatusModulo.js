var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var createStatusModulo = function (string, bateria, temperatura, impedancia, tensao, equalizacao, min_temp, max_temp, min_imp, max_imp, min_tensao, max_tensao) {
    return {
        string: string, 
        bateria: bateria, 
        temperatura: temperatura, 
        impedancia: impedancia, 
        tensao: tensao, 
        equalizacao: equalizacao,
        min_temp: min_temp, 
        max_temp: max_temp, 
        min_imp: min_imp, 
        max_imp: max_imp, 
        min_tensao: min_tensao, 
        max_tensao: max_tensao,
        percentualTensao: 100- (((parseFloat(tensao)/parseFloat(max_tensao)) * 100.00) > 100.00 ? 100.00 : ((parseFloat(tensao)/parseFloat(max_tensao)) * 100.00)),
        precentualMinTensao: (((parseFloat(tensao)/parseFloat(min_tensao)) * 100.00) > 100.00 ? 100.00 : ((parseFloat(tensao)/parseFloat(min_tensao)) * 100.00)),
        percentualEqualizacao: equalizacao / 60000 * 100
    }
}
var createChart = function (data, max_temperatura, max_impedancia, max_tensao,  min_temperatura, min_impedancia, min_tensao,  avg_temperatura, avg_impedancia, avg_tensao,
                            temperatura_atual, impedancia_atual, tensao_atual) {
    return {
        data: data,
        max_temperatura: max_temperatura,
        max_impedancia: max_impedancia,
        max_tensao: max_tensao,
        min_temperatura: min_temperatura,
        min_impedancia: min_impedancia,
        min_tensao: min_tensao,
        avg_temperatura: avg_temperatura,
        avg_impedancia: avg_impedancia,
        avg_tensao: avg_tensao,
        temperatura_atual: temperatura_atual,
        impedancia_atual: impedancia_atual,
        tensao_atual: tensao_atual
    }
}

var get = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000')
    var strSql = ""
    strSql = strSql + "SELECT 	RVAL.STRING, ";
    strSql = strSql + "		    RVAL.BATERIA, ";
    strSql = strSql + "		    DLOG.TEMPERATURA, ";
    strSql = strSql + "		    DLOG.IMPEDANCIA, ";
    strSql = strSql + "		    DLOG.TENSAO, ";
    strSql = strSql + "		    DLOG.EQUALIZACAO, ";
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
            statusModulos.push(new createStatusModulo(row.STRING, row.BATERIA, row.temperatura, row.impedancia, row.tensao, row.equalizacao, row.alarme_nivel_temp_min, row.alarme_nivel_temp_max, row.alarme_nivel_imped_min, row.alarme_nivel_imped_max, 10.5, 13.5));
        });
        data(err, statusModulos);
    });
    db.close();
}
    var getChartDay = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000')
    var strSql = "";
    strSql = strSql + "SELECT 	X.DATA, \n";
    strSql = strSql + "		X.MAX_TEMPERATURA, \n";
    strSql = strSql + "		X.MAX_IMPEDANCIA, \n";
    strSql = strSql + "		X.MAX_TENSAO, \n";
    strSql = strSql + "		X.MIN_TEMPERATURA, \n";
    strSql = strSql + "		X.MIN_IMPEDANCIA, \n";
    strSql = strSql + "		X.MIN_TENSAO, \n";
    strSql = strSql + "		X.AVG_TEMPERATURA, \n";
    strSql = strSql + "		X.AVG_IMPEDANCIA, \n";
    strSql = strSql + "		X.AVG_TENSAO, \n";
    strSql = strSql + "		D.TEMPERATURA 	TEMPERATURA_ATUAL, \n";
    strSql = strSql + "		D.IMPEDANCIA	IMPEDANCIA_ATUAL, \n";
    strSql = strSql + "		D.TENSAO		TENSAO_ATUAL \n";
    strSql = strSql + " FROM ( \n";
    strSql = strSql + "SELECT STRFTIME('%Y/%m/%d %H:%M:%S', DATAHORA) DATA, \n";
    strSql = strSql + "		MAX(ID) ID, \n";
    strSql = strSql + "		MAX(TEMPERATURA) 	MAX_TEMPERATURA, \n";
    strSql = strSql + "		MAX(IMPEDANCIA)		MAX_IMPEDANCIA, \n";
    strSql = strSql + "		MAX(TENSAO)			MAX_TENSAO, \n";
    strSql = strSql + "		MIN(TEMPERATURA)	MIN_TEMPERATURA, \n";
    strSql = strSql + "		MIN(IMPEDANCIA)		MIN_IMPEDANCIA, \n";
    strSql = strSql + "		MIN(TENSAO)			MIN_TENSAO, \n";
    strSql = strSql + "		AVG(TEMPERATURA)	AVG_TEMPERATURA, \n";
    strSql = strSql + "		AVG(IMPEDANCIA)		AVG_IMPEDANCIA, \n";
    strSql = strSql + "		AVG(TENSAO)			AVG_TENSAO \n";
    strSql = strSql + "FROM DATALOG \n";
    strSql = strSql + "group by STRFTIME('%Y/%m/%d %H:%M:%S', DATAHORA) \n";
    strSql = strSql + ") AS X \n";
    strSql = strSql + "LEFT JOIN DATALOG D ON (D.ID = X.ID)";

    db.all(strSql, function (err, rows) {
        var chartData = [];
        rows.forEach(function row(row) {
            chartData.push(new createChart(row.DATA, row.MAX_TEMPERATURA, row.MAX_IMPEDANCIA, row.MAX_TENSAO, row.MIN_TEMPERATURA, row.MIN_IMPEDANCIA, row.MIN_TENSAO,  
                                            row.AVG_TEMPERATURA, row.AVG_IMPEDANCIA, row.AVG_TENSAO, row.TEMPERATURA_ATUAL, row.IMPEDANCIA_ATUAL, row.TENSAO_ATUAL));
        });
        data(err, chartData);
    });
    db.close();
}
var getChartMonth = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000')
    var strSql = "";
    strSql = strSql + "SELECT 	X.DATA, \n";
    strSql = strSql + "		X.MAX_TEMPERATURA, \n";
    strSql = strSql + "		X.MAX_IMPEDANCIA, \n";
    strSql = strSql + "		X.MAX_TENSAO, \n";
    strSql = strSql + "		X.MIN_TEMPERATURA, \n";
    strSql = strSql + "		X.MIN_IMPEDANCIA, \n";
    strSql = strSql + "		X.MIN_TENSAO, \n";
    strSql = strSql + "		X.AVG_TEMPERATURA, \n";
    strSql = strSql + "		X.AVG_IMPEDANCIA, \n";
    strSql = strSql + "		X.AVG_TENSAO, \n";
    strSql = strSql + "		D.TEMPERATURA 	TEMPERATURA_ATUAL, \n";
    strSql = strSql + "		D.IMPEDANCIA	IMPEDANCIA_ATUAL, \n";
    strSql = strSql + "		D.TENSAO		TENSAO_ATUAL \n";
    strSql = strSql + " FROM ( \n";
    strSql = strSql + "SELECT STRFTIME('%m/%Y', DATAHORA) DATA, \n";
    strSql = strSql + "		MAX(ID) ID, \n";
    strSql = strSql + "		MAX(TEMPERATURA) 	MAX_TEMPERATURA, \n";
    strSql = strSql + "		MAX(IMPEDANCIA)		MAX_IMPEDANCIA, \n";
    strSql = strSql + "		MAX(TENSAO)			MAX_TENSAO, \n";
    strSql = strSql + "		MIN(TEMPERATURA)	MIN_TEMPERATURA, \n";
    strSql = strSql + "		MIN(IMPEDANCIA)		MIN_IMPEDANCIA, \n";
    strSql = strSql + "		MIN(TENSAO)			MIN_TENSAO, \n";
    strSql = strSql + "		AVG(TEMPERATURA)	AVG_TEMPERATURA, \n";
    strSql = strSql + "		AVG(IMPEDANCIA)		AVG_IMPEDANCIA, \n";
    strSql = strSql + "		AVG(TENSAO)			AVG_TENSAO \n";
    strSql = strSql + "FROM DATALOG \n";
    strSql = strSql + "group by STRFTIME('%m/%Y', DATAHORA) \n";
    strSql = strSql + ") AS X \n";
    strSql = strSql + "LEFT JOIN DATALOG D ON (D.ID = X.ID)";

    db.all(strSql, function (err, rows) {
        var chartData = [];
        rows.forEach(function row(row) {
            chartData.push(new createChart(row.DATA, row.MAX_TEMPERATURA, row.MAX_IMPEDANCIA, row.MAX_TENSAO, row.MIN_TEMPERATURA, row.MIN_IMPEDANCIA, row.MIN_TENSAO,  
                                            row.AVG_TEMPERATURA, row.AVG_IMPEDANCIA, row.AVG_TENSAO, row.TEMPERATURA_ATUAL, row.IMPEDANCIA_ATUAL, row.TENSAO_ATUAL));
        });
        data(err, chartData);
    });
    db.close();
}
var getChartYear = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000')
    var strSql = "";
    strSql = strSql + "SELECT 	X.DATA, \n";
    strSql = strSql + "		X.MAX_TEMPERATURA, \n";
    strSql = strSql + "		X.MAX_IMPEDANCIA, \n";
    strSql = strSql + "		X.MAX_TENSAO, \n";
    strSql = strSql + "		X.MIN_TEMPERATURA, \n";
    strSql = strSql + "		X.MIN_IMPEDANCIA, \n";
    strSql = strSql + "		X.MIN_TENSAO, \n";
    strSql = strSql + "		X.AVG_TEMPERATURA, \n";
    strSql = strSql + "		X.AVG_IMPEDANCIA, \n";
    strSql = strSql + "		X.AVG_TENSAO, \n";
    strSql = strSql + "		D.TEMPERATURA 	TEMPERATURA_ATUAL, \n";
    strSql = strSql + "		D.IMPEDANCIA	IMPEDANCIA_ATUAL, \n";
    strSql = strSql + "		D.TENSAO		TENSAO_ATUAL \n";
    strSql = strSql + " FROM ( \n";
    strSql = strSql + "SELECT STRFTIME('%Y', DATAHORA) DATA, \n";
    strSql = strSql + "		MAX(ID) ID, \n";
    strSql = strSql + "		MAX(TEMPERATURA) 	MAX_TEMPERATURA, \n";
    strSql = strSql + "		MAX(IMPEDANCIA)		MAX_IMPEDANCIA, \n";
    strSql = strSql + "		MAX(TENSAO)			MAX_TENSAO, \n";
    strSql = strSql + "		MIN(TEMPERATURA)	MIN_TEMPERATURA, \n";
    strSql = strSql + "		MIN(IMPEDANCIA)		MIN_IMPEDANCIA, \n";
    strSql = strSql + "		MIN(TENSAO)			MIN_TENSAO, \n";
    strSql = strSql + "		AVG(TEMPERATURA)	AVG_TEMPERATURA, \n";
    strSql = strSql + "		AVG(IMPEDANCIA)		AVG_IMPEDANCIA, \n";
    strSql = strSql + "		AVG(TENSAO)			AVG_TENSAO \n";
    strSql = strSql + "FROM DATALOG \n";
    strSql = strSql + "group by STRFTIME('%Y', DATAHORA) \n";
    strSql = strSql + ") AS X \n";
    strSql = strSql + "LEFT JOIN DATALOG D ON (D.ID = X.ID)";

    db.all(strSql, function (err, rows) {
        var chartData = [];
        rows.forEach(function row(row) {
            chartData.push(new createChart(row.DATA, row.MAX_TEMPERATURA, row.MAX_IMPEDANCIA, row.MAX_TENSAO, row.MIN_TEMPERATURA, row.MIN_IMPEDANCIA, row.MIN_TENSAO,  
                                            row.AVG_TEMPERATURA, row.AVG_IMPEDANCIA, row.AVG_TENSAO, row.TEMPERATURA_ATUAL, row.IMPEDANCIA_ATUAL, row.TENSAO_ATUAL));
        });
        data(err, chartData);
    });
    db.close();
}
module.exports.get = get;
module.exports.getChartDay = getChartDay;
module.exports.getChartMonth = getChartMonth;
module.exports.getChartYear = getChartYear;