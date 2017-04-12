var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('equalizerdb');
var init = function () {
    console.log("Criando DB");
    db.serialize(function () {
        db.run("CREATE TABLE IF NOT EXISTS Usuario (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, sobreNome TEXT, telefone TEXT, email TEXT, senha TEXT, acesso TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS AlarmeConfig (id INTEGER PRIMARY KEY AUTOINCREMENT, nivel_alert_tensao_max REAL, nivel_alert_tensao_min REAL, nivel_alert_temp_max REAL, nivel_alert_temp_min REAL, nivel_alert_impedancia_max REAL, nivel_alert_impedancia_min REAL, nivel_max_tensao_ativo INTEGER, nivel_max_tensao_val REAL, alarme_nivel_tensao_max REAL, alarme_nivel_tensao_min REAL, alarme_nivel_temp_max REAL, alarme_nivel_temp_min REAL, alarme_nivel_imped_max REAL, alarme_nivel_imped_min REAL)");
        db.run("CREATE TABLE IF NOT EXISTS Modulo (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT, tensao_nominal REAL, n_strings INTEGER, n_baterias_por_strings INTEGER, contato TEXT, localizacao TEXT, fabricante TEXT, tipo TEXT, data_instalacao TEXT, conf_alarme_id INTEGER , FOREIGN KEY(conf_alarme_id) REFERENCES AlarmeConfig(id))");
        db.run("CREATE TABLE IF NOT EXISTS DataLog (id INTEGER PRIMARY KEY AUTOINCREMENT, dataHora TEXT, string TEXT, bateria TEXT, temperatura REAL, impedancia REAL, tensao REAL, equalizacao REAL)");
        db.run("CREATE TABLE IF NOT EXISTS AlarmLog (id INTEGER PRIMARY KEY AUTOINCREMENT, dataHora TEXT, descricao TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS RedeSeguranca (id INTEGER PRIMARY KEY AUTOINCREMENT, mac, velocidadePlacaRede TEXT, localAddress TEXT, gateway TEXT, mascara TEXT, servidorDNS TEXT, nomeDoSistema TEXT, localDoSistema TEXT, contatoDoSistema TEXT, httpPort INTEGER, useHttps INTEGER, httpsPort INTEGER, httpTempoDeAtualizacao INTEGER, paginaPadraoHttp TEXT)");

        //Triggers
        var strSql = "";
        strSql += "CREATE TRIGGER IF NOT EXISTS raiseAlert AFTER INSERT ON DataLog ";
        strSql += "BEGIN ";
        strSql += "  ";
        strSql += " INSERT INTO ALARMLOG(dataHora, descricao) ";
        strSql += "	SELECT datetime(), 'Alerta de Tensão em ' || NEW.string || '-' || NEW .bateria || ', Mínima: '|| NEW.tensao ||' de ' || ALARME_NIVEL_TENSAO_MIN ";
        strSql += "	FROM ALARMECONFIG WHERE NEW.tensao < ALARME_NIVEL_TENSAO_MIN ";
        strSql += "	UNION ";
        strSql += "	SELECT datetime(), 'Alerta de Impedância em ' || NEW.string || '-' || NEW .bateria || ', Mínima: '|| NEW.impedancia ||' de ' || ALARME_NIVEL_IMPED_MIN ";
        strSql += "	FROM ALARMECONFIG WHERE NEW.impedancia < ALARME_NIVEL_IMPED_MIN ";
        strSql += "	UNION ";
        strSql += "	SELECT datetime(), 'Alerta de Temperatura em ' || NEW.string || '-' || NEW .bateria || ', Mínima: '|| NEW.temperatura ||' de ' || ALARME_NIVEL_Temp_MIN ";
        strSql += "	FROM ALARMECONFIG WHERE NEW.temperatura < ALARME_NIVEL_Temp_MIN ";
        strSql += "	UNION ";
        strSql += "	SELECT datetime(), 'Alerta de Tensão em ' || NEW.string || '-' || NEW .bateria || ', Máxima: '|| NEW.tensao ||' de ' || ALARME_NIVEL_TENSAO_MAX ";
        strSql += "	FROM ALARMECONFIG WHERE NEW.tensao > ALARME_NIVEL_TENSAO_MAX ";
        strSql += "	UNION ";
        strSql += "	SELECT datetime(), 'Alerta de Impedância em ' || NEW.string || '-' || NEW .bateria || ', Máxima: '|| NEW.impedancia ||' de ' || ALARME_NIVEL_IMPED_MAX ";
        strSql += "	FROM ALARMECONFIG WHERE NEW.impedancia > ALARME_NIVEL_IMPED_MAX ";
        strSql += "	UNION ";
        strSql += "	SELECT datetime(), 'Alerta de Temperatura em ' || NEW.string || '-' || NEW .bateria || ', Máxima: '|| NEW.temperatura ||' de ' || ALARME_NIVEL_Temp_MAX ";
        strSql += "	FROM ALARMECONFIG WHERE NEW.temperatura > ALARME_NIVEL_Temp_MAX; ";
        strSql += "		 ";
        strSql += "END;" ;
        db.run(strSql);
    });
    db.close();
};
module.exports.init = init;