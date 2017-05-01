var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var createAlarmeConfig = function ( id, tipo_modulo, nivel_alert_tensao_max, nivel_alert_tensao_min, nivel_alert_temp_max, nivel_alert_temp_min, nivel_alert_impedancia_max,
                                    nivel_alert_impedancia_min, nivel_max_tensao_ativo, nivel_max_tensao_val, alarme_nivel_tensao_max, alarme_nivel_tensao_min,
                                    alarme_nivel_temp_max, alarme_nivel_temp_min, alarme_nivel_imped_max, alarme_nivel_imped_min) {
    return {
        id: id,
        tipo_modulo: tipo_modulo,
        nivel_alert_tensao_max: nivel_alert_tensao_max.toFixed(3),
        nivel_alert_tensao_min: nivel_alert_tensao_min.toFixed(3),
        nivel_alert_temp_max: nivel_alert_temp_max.toFixed(1),
        nivel_alert_temp_min: nivel_alert_temp_min.toFixed(1),
        nivel_alert_impedancia_max: nivel_alert_impedancia_max.toFixed(1),
        nivel_alert_impedancia_min: nivel_alert_impedancia_min.toFixed(1),
        nivel_max_tensao_ativo: nivel_max_tensao_ativo.toFixed(3),
        nivel_max_tensao_val: nivel_max_tensao_val.toFixed(3),
        alarme_nivel_tensao_max: alarme_nivel_tensao_max.toFixed(3),
        alarme_nivel_tensao_min: alarme_nivel_tensao_min.toFixed(3),
        alarme_nivel_temp_max: alarme_nivel_temp_max.toFixed(1),
        alarme_nivel_temp_min: alarme_nivel_temp_min.toFixed(1),
        alarme_nivel_imped_max: alarme_nivel_imped_max.toFixed(1),
        alarme_nivel_imped_min: alarme_nivel_imped_min.toFixed(1)
    }
}
var save = function (alarmeConfig, err) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000;');
    db.run('PRAGMA journal_mode=WAL;');
    var stmt = db.prepare("INSERT INTO AlarmeConfig(tipo_modulo, nivel_alert_tensao_max, nivel_alert_tensao_min, nivel_alert_temp_max, nivel_alert_temp_min, nivel_alert_impedancia_max, " +
                                    "nivel_alert_impedancia_min, nivel_max_tensao_ativo, nivel_max_tensao_val, alarme_nivel_tensao_max, alarme_nivel_tensao_min, " +
                                    "alarme_nivel_temp_max, alarme_nivel_temp_min, alarme_nivel_imped_max, alarme_nivel_imped_min) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    stmt.run(alarmeConfig.tipo_modulo, alarmeConfig.nivel_alert_tensao_max, alarmeConfig.nivel_alert_tensao_min, alarmeConfig.nivel_alert_temp_max, alarmeConfig.nivel_alert_temp_min, 
                alarmeConfig.nivel_alert_impedancia_max, alarmeConfig.nivel_alert_impedancia_min, alarmeConfig.nivel_max_tensao_ativo, alarmeConfig.nivel_max_tensao_val, 
                alarmeConfig.alarme_nivel_tensao_max, alarmeConfig.alarme_nivel_tensao_min, alarmeConfig.alarme_nivel_temp_max, alarmeConfig.alarme_nivel_temp_min, 
                alarmeConfig.alarme_nivel_imped_max, alarmeConfig.alarme_nivel_imped_min);
    stmt.finalize();
    db.close();
}
var getAll = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.all("SELECT id, tipo_modulo, nivel_alert_tensao_max, nivel_alert_tensao_min, nivel_alert_temp_max, nivel_alert_temp_min, nivel_alert_impedancia_max, " +
                                    "nivel_alert_impedancia_min, nivel_max_tensao_ativo, nivel_max_tensao_val, alarme_nivel_tensao_max, alarme_nivel_tensao_min, " +
                                    "alarme_nivel_temp_max, alarme_nivel_temp_min, alarme_nivel_imped_max, alarme_nivel_imped_min " +
            "FROM AlarmeConfig", function (err, rows) {
        var alarmesConfig = [];
        rows.forEach(function row(row) {
            alarmesConfig.push(new createAlarmeConfig(row.id, row.tipo_modulo, row.nivel_alert_tensao_max, row.nivel_alert_tensao_min, row.nivel_alert_temp_max, row.nivel_alert_temp_min, 
                                    row.nivel_alert_impedancia_max, row.nivel_alert_impedancia_min, row.nivel_max_tensao_ativo == 1 ? true : false, row.nivel_max_tensao_val, 
                                    row.alarme_nivel_tensao_max, row.alarme_nivel_tensao_min, row.alarme_nivel_temp_max, row.alarme_nivel_temp_min, 
                                    row.alarme_nivel_imped_max, row.alarme_nivel_imped_min));
        });
        data(err, alarmesConfig);
    });
    db.close();
}
var getById = function (id, data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.get("SELECT id, tipo_modulo, nivel_alert_tensao_max, nivel_alert_tensao_min, nivel_alert_temp_max, nivel_alert_temp_min, nivel_alert_impedancia_max, " +
                                    "nivel_alert_impedancia_min, nivel_max_tensao_ativo, nivel_max_tensao_val, alarme_nivel_tensao_max, alarme_nivel_tensao_min, " +
                                    "alarme_nivel_temp_max, alarme_nivel_temp_min, alarme_nivel_imped_max, alarme_nivel_imped_min " +
            "FROM AlarmeConfig WHERE id = $id", { $id: id }, function (err, row) {
        if (row) {
            var alarmeConfig = new createAlarmeConfig(row.id, row.tipo_modulo, row.nivel_alert_tensao_max, row.nivel_alert_tensao_min, row.nivel_alert_temp_max, row.nivel_alert_temp_min, 
                                    row.nivel_alert_impedancia_max, row.nivel_alert_impedancia_min, row.nivel_max_tensao_ativo == 1 ? true : false, row.nivel_max_tensao_val, 
                                    row.alarme_nivel_tensao_max, row.alarme_nivel_tensao_min, row.alarme_nivel_temp_max, row.alarme_nivel_temp_min, 
                                    row.alarme_nivel_imped_max, row.alarme_nivel_imped_min);
            console.log(alarmeConfig);
            data(err, alarmeConfig);
        }
        else
            data(err, null);
    });
    db.close();
}
var update = function (alarmeConfig) {
    getAll(function(err, alarmesConfig){
        if(alarmesConfig.length <= 0){
            save(alarmeConfig);
            return;
        }
    });
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.run("UPDATE AlarmeConfig SET tipo_modulo = $tipo_modulo, nivel_alert_tensao_max = $nivel_alert_tensao_max, nivel_alert_tensao_min = $nivel_alert_tensao_min, nivel_alert_temp_max = $nivel_alert_temp_max, nivel_alert_temp_min = $nivel_alert_temp_min, nivel_alert_impedancia_max = $nivel_alert_impedancia_max, " +
                                    "nivel_alert_impedancia_min = $nivel_alert_impedancia_min, nivel_max_tensao_ativo = $nivel_max_tensao_ativo, nivel_max_tensao_val = $nivel_max_tensao_val, alarme_nivel_tensao_max = $alarme_nivel_tensao_max, alarme_nivel_tensao_min = $alarme_nivel_tensao_min, " +
                                    "alarme_nivel_temp_max = $alarme_nivel_temp_max, alarme_nivel_temp_min = $alarme_nivel_temp_min, alarme_nivel_imped_max = $alarme_nivel_imped_max, alarme_nivel_imped_min = $alarme_nivel_imped_min " +
                "WHERE id = $id", { $id: alarmeConfig.id,
                                    $tipo_modulo: alarmeConfig.tipo_modulo,
                                    $nivel_alert_tensao_max: alarmeConfig.nivel_alert_tensao_max,
                                    $nivel_alert_tensao_min: alarmeConfig.nivel_alert_tensao_min,
                                    $nivel_alert_temp_max: alarmeConfig.nivel_alert_temp_max,
                                    $nivel_alert_temp_min: alarmeConfig.nivel_alert_temp_min,
                                    $nivel_alert_impedancia_max: alarmeConfig.nivel_alert_impedancia_max,
                                    $nivel_alert_impedancia_min: alarmeConfig.nivel_alert_impedancia_min,
                                    $nivel_max_tensao_ativo: alarmeConfig.nivel_max_tensao_ativo,
                                    $nivel_max_tensao_val: alarmeConfig.nivel_max_tensao_val,
                                    $alarme_nivel_tensao_max: alarmeConfig.alarme_nivel_tensao_max,
                                    $alarme_nivel_tensao_min: alarmeConfig.alarme_nivel_tensao_min,
                                    $alarme_nivel_temp_max: alarmeConfig.alarme_nivel_temp_max,
                                    $alarme_nivel_temp_min: alarmeConfig.alarme_nivel_temp_min,
                                    $alarme_nivel_imped_max: alarmeConfig.alarme_nivel_imped_max,
                                    $alarme_nivel_imped_min: alarmeConfig.alarme_nivel_imped_min });
    db.close();
}
module.exports.save = save;
module.exports.createAlarmeConfig = createAlarmeConfig;
module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.update = update;