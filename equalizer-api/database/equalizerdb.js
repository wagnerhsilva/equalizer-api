var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('equalizerdb');
var init = function () {
    console.log("Criando DB");
    db.serialize(function () {
	db.run("CREATE TABLE IF NOT EXISTS AlarmLog (id INTEGER PRIMARY KEY AUTOINCREMENT,dataHora TEXT, descricao TEXT, emailEnviado INTEGER, n_ocorrencias INTEGER DEFAULT 0, param TEXT,bateria TEXT DEFAULT NULL,string TEXT DEFAULT NULL,val TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS AlarmeConfig ( id INTEGER PRIMARY KEY AUTOINCREMENT, tipo_modulo TEXT, nivel_alert_tensao_max REAL, nivel_alert_tensao_min REAL, nivel_alert_temp_max REAL, nivel_alert_temp_min REAL, nivel_alert_impedancia_max REAL, nivel_alert_impedancia_min REAL, nivel_max_tensao_ativo INTEGER, nivel_max_tensao_val REAL, alarme_nivel_tensao_max REAL, alarme_nivel_tensao_min REAL, alarme_nivel_temp_max REAL, alarme_nivel_temp_min REAL, alarme_nivel_imped_max REAL, alarme_nivel_imped_min REAL, alarme_nivel_tensaoBarr_min REAL, alarme_nivel_tensaoBarr_max REAL, alarme_nivel_target_min REAL, alarme_nivel_target_max REAL )");
        db.run("CREATE TABLE IF NOT EXISTS DataLog ( id INTEGER PRIMARY KEY AUTOINCREMENT, dataHora TEXT, string TEXT, bateria TEXT, temperatura REAL, impedancia REAL, tensao REAL, equalizacao REAL, target REAL )");
        db.run("CREATE TABLE IF NOT EXISTS DataLogRT ( id INTEGER PRIMARY KEY AUTOINCREMENT, dataHora TEXT, string TEXT, bateria TEXT, temperatura REAL, impedancia REAL, tensao REAL, equalizacao REAL, batstatus REAL )");
        db.run("CREATE TABLE IF NOT EXISTS EmailServer (id INTEGER PRIMARY KEY AUTOINCREMENT, server TEXT, portaSMTP INTEGER, usarCriptografiaTLS INTEGER, email TEXT, assunto TEXT, usarAutenticacao INTEGER, login TEXT, senha TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS Modulo ( id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT, tensao_nominal REAL, capacidade_nominal INTEGER, n_strings INTEGER, n_baterias_por_strings INTEGER, contato TEXT, localizacao TEXT, fabricante TEXT, tipo TEXT, data_instalacao TEXT, baterias_por_hr TEXT, conf_alarme_id INTEGER, FOREIGN KEY(conf_alarme_id) REFERENCES AlarmeConfig(id) )");
        db.run("CREATE TABLE IF NOT EXISTS Parameters ( id INTEGER PRIMARY KEY AUTOINCREMENT, avg_last TEXT, duty_min TEXT, duty_max TEXT, cte_index TEXT, delay TEXT, num_cycles_var_read TEXT, bus_voltage TEXT, save_log_time TEXT, disk_capacity TEXT, param1 TEXT, param2 TEXT, param3 TEXT, param4 TEXT, param5 TEXT, param6 TEXT, param7 TEXT, param8 TEXT, param9 TEXT, param10 TEXT )");
        db.run("CREATE TABLE IF NOT EXISTS RedeSeguranca (id INTEGER PRIMARY KEY AUTOINCREMENT, mac, velocidadePlacaRede TEXT, localAddress TEXT, gateway TEXT, mascara TEXT, servidorDNS TEXT, nomeDoSistema TEXT, localDoSistema TEXT, contatoDoSistema TEXT, httpPort INTEGER, useHttps INTEGER, httpsPort INTEGER, httpTempoDeAtualizacao INTEGER, paginaPadraoHttp TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS TimeServer (id INTEGER PRIMARY KEY AUTOINCREMENT, timeServerAddress1 TEXT, timeServerAddress1_complemento TEXT, timeServerAddress2 TEXT, timeServerAddress2_complemento TEXT, timeServerAddress3 TEXT, timeServerAddress3_complemento TEXT, connectionRetries INTEGER, timeZone TEXT, automAdjustTimeDaylightSavingChanges INTEGER)");
        db.run("CREATE TABLE IF NOT EXISTS Usuario (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, sobreNome TEXT, telefone TEXT, email TEXT, senha TEXT, acesso TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS ApelidoString ( String TEXT, Apelido TEXT )");
		db.run("CREATE TABLE IF NOT EXISTS Medias ( id INTEGER PRIMARY KEY, tensao REAL, target REAL )");
		//TRIGGERS
		
		
        //INDEXES
        db.run("CREATE INDEX IF NOT EXISTS idx_alarmlog_ata ON AlarmLog (dataHora)");
        db.run("CREATE INDEX IF NOT EXISTS idx_alarmlog_descricao ON AlarmLog (descricao)");

        //Valor Default para Duty Max, caso reinicie a aplicação
        db.run("UPDATE Parameters SET duty_max = '45000';");
    });
    db.close();
};
module.exports.init = init;
