var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var createAlarmeConfig = function (id, tipo_modulo, nivel_alert_tensao_max, nivel_alert_tensao_min, nivel_alert_temp_max, nivel_alert_temp_min, nivel_alert_impedancia_max,
    nivel_alert_impedancia_min, nivel_max_tensao_ativo, nivel_max_tensao_val, alarme_nivel_tensao_max, alarme_nivel_tensao_min,
    alarme_nivel_temp_max, alarme_nivel_temp_min, alarme_nivel_imped_max, alarme_nivel_imped_min, alarme_nivel_tensao_barr_max,
    alarme_nivel_tensao_barr_min, alarme_nivel_target_max, alarme_nivel_target_min, alarme_nivel_imped_pre, alarme_nivel_temp_pre, alarme_nivel_tens_pre, alarme_pre_enabled) {
    return {
        id: id,
        tipo_modulo: tipo_modulo,
        nivel_alert_tensao_max: nivel_alert_tensao_max != 0 ? nivel_alert_tensao_max.toFixed(3) : 0,
        nivel_alert_tensao_min: nivel_alert_tensao_min != 0 ? nivel_alert_tensao_min.toFixed(3) : 0,
        nivel_alert_temp_max: nivel_alert_temp_max != 0 ? nivel_alert_temp_max.toFixed(1) : 0,
        nivel_alert_temp_min: nivel_alert_temp_min != 0 ? nivel_alert_temp_min.toFixed(1) : 0,
        nivel_alert_impedancia_max: nivel_alert_impedancia_max != 0 ? nivel_alert_impedancia_max.toFixed(1) : 0,
        nivel_alert_impedancia_min: nivel_alert_impedancia_min != 0 ? nivel_alert_impedancia_min.toFixed(1) : 0,
        nivel_max_tensao_ativo: nivel_max_tensao_ativo,
        nivel_max_tensao_val: nivel_max_tensao_val != 0 ? nivel_max_tensao_val.toFixed(3) : 0,
        alarme_nivel_tensao_max: alarme_nivel_tensao_max != 0 ? alarme_nivel_tensao_max.toFixed(3) : 0,
        alarme_nivel_tensao_min: alarme_nivel_tensao_min != 0 ? alarme_nivel_tensao_min.toFixed(3) : 0,
        alarme_nivel_temp_max: alarme_nivel_temp_max != 0 ? alarme_nivel_temp_max.toFixed(1) : 0,
        alarme_nivel_temp_min: alarme_nivel_temp_min != 0 ? alarme_nivel_temp_min.toFixed(1) : 0,
        alarme_nivel_imped_max: alarme_nivel_imped_max != 0 ? alarme_nivel_imped_max.toFixed(1) : 0,
        alarme_nivel_imped_min: alarme_nivel_imped_min != 0 ? alarme_nivel_imped_min.toFixed(1) : 0,
        alarme_nivel_tensao_barr_max: alarme_nivel_tensao_barr_max != 0 ? alarme_nivel_tensao_barr_max.toFixed(3) : 0,
        alarme_nivel_tensao_barr_min: alarme_nivel_tensao_barr_min != 0 ? alarme_nivel_tensao_barr_min.toFixed(3) : 0,
        alarme_nivel_target_max: alarme_nivel_target_max != 0 ? alarme_nivel_target_max.toFixed(3) : 0,
        alarme_nivel_target_min: alarme_nivel_target_min != 0 ? alarme_nivel_target_min.toFixed(3) : 0,
        alarme_nivel_imped_pre: alarme_nivel_imped_pre != 0 ?alarme_nivel_imped_pre.toFixed(3) : 0,
        alarme_nivel_temp_pre: alarme_nivel_temp_pre != 0 ? alarme_nivel_temp_pre.toFixed(3) : 0,
        alarme_nivel_tens_pre: alarme_nivel_tens_pre != 0 ? alarme_nivel_tens_pre.toFixed(3) : 0,
        alarme_pre_enabled: alarme_pre_enabled == 1 ? true : false
    }
}
var save = function (alarmeConfig, err) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    var stmt = db.prepare("INSERT INTO AlarmeConfig(tipo_modulo, nivel_alert_tensao_max, nivel_alert_tensao_min, nivel_alert_temp_max, nivel_alert_temp_min, nivel_alert_impedancia_max, " +
        "nivel_alert_impedancia_min, nivel_max_tensao_ativo, nivel_max_tensao_val, alarme_nivel_tensao_max, alarme_nivel_tensao_min, " +
        "alarme_nivel_temp_max, alarme_nivel_temp_min, alarme_nivel_imped_max, alarme_nivel_imped_min, alarme_nivel_tensaoBarr_max, " +
        "alarme_nivel_tensaoBarr_min, alarme_nivel_target_max, alarme_nivel_target_min, alarme_pre_enabled) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    stmt.run(alarmeConfig.tipo_modulo, alarmeConfig.nivel_alert_tensao_max, alarmeConfig.nivel_alert_tensao_min, alarmeConfig.nivel_alert_temp_max, alarmeConfig.nivel_alert_temp_min,
        alarmeConfig.nivel_alert_impedancia_max, alarmeConfig.nivel_alert_impedancia_min, alarmeConfig.nivel_max_tensao_ativo, alarmeConfig.nivel_max_tensao_val,
        alarmeConfig.alarme_nivel_tensao_max, alarmeConfig.alarme_nivel_tensao_min, alarmeConfig.alarme_nivel_temp_max, alarmeConfig.alarme_nivel_temp_min,
        alarmeConfig.alarme_nivel_imped_max, alarmeConfig.alarme_nivel_imped_min, alarmeConfig.alarme_nivel_tensaoBarr_max, alarmeConfig.alarme_nivel_tensaoBarr_min,
        alarmeConfig.alarme_nivel_target_max, alarmeConfig.alarme_nivel_target_min,
        alarmeConfig.alarme_pre_enabled ? 1 : 0);
    stmt.finalize();
    db.close();
}

var save_complete = function(alarmeConfig, err){
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    var stmt = db.prepare("INSERT INTO AlarmeConfig(tipo_modulo, nivel_alert_tensao_max, nivel_alert_tensao_min, nivel_alert_temp_max, nivel_alert_temp_min, nivel_alert_impedancia_max, " +
        "nivel_alert_impedancia_min, nivel_max_tensao_ativo, nivel_max_tensao_val, alarme_nivel_tensao_max, alarme_nivel_tensao_min, " +
        "alarme_nivel_temp_max, alarme_nivel_temp_min, alarme_nivel_imped_max, alarme_nivel_imped_min, alarme_nivel_tensaoBarr_max, " +
        "alarme_nivel_tensaoBarr_min, alarme_nivel_target_max, alarme_nivel_target_min, alarme_nivel_imped_pre, alarme_nivel_temp_pre, alarme_nivel_tens_pre, alarme_pre_enabled) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    stmt.run(alarmeConfig.tipo_modulo, alarmeConfig.nivel_alert_tensao_max, alarmeConfig.nivel_alert_tensao_min, alarmeConfig.nivel_alert_temp_max, alarmeConfig.nivel_alert_temp_min,
        alarmeConfig.nivel_alert_impedancia_max, alarmeConfig.nivel_alert_impedancia_min, alarmeConfig.nivel_max_tensao_ativo, alarmeConfig.nivel_max_tensao_val,
        alarmeConfig.alarme_nivel_tensao_max, alarmeConfig.alarme_nivel_tensao_min, alarmeConfig.alarme_nivel_temp_max, alarmeConfig.alarme_nivel_temp_min,
        alarmeConfig.alarme_nivel_imped_max, alarmeConfig.alarme_nivel_imped_min, alarmeConfig.alarme_nivel_tensaoBarr_max, alarmeConfig.alarme_nivel_tensaoBarr_min,
        alarmeConfig.alarme_nivel_target_max, alarmeConfig.alarme_nivel_target_min,
        alarmeConfig.alarme_nivel_imped_pre,
        alarmeConfig.alarme_nivel_temp_pre,
        alarmeConfig.alarme_nivel_tens_pre, alarmeConfig.alarme_pre_enabled ? 1 : 0);
    stmt.finalize();
    db.close();
};

var getAll = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.all("SELECT id, tipo_modulo, nivel_alert_tensao_max, nivel_alert_tensao_min, nivel_alert_temp_max, nivel_alert_temp_min, nivel_alert_impedancia_max, " +
        "nivel_alert_impedancia_min, nivel_max_tensao_ativo, nivel_max_tensao_val, alarme_nivel_tensao_max, alarme_nivel_tensao_min, " +
        "alarme_nivel_temp_max, alarme_nivel_temp_min, alarme_nivel_imped_max, alarme_nivel_imped_min, alarme_nivel_tensaoBarr_max, " +
        "alarme_nivel_tensaoBarr_min, alarme_nivel_target_max, alarme_nivel_target_min, alarme_nivel_imped_pre, alarme_nivel_temp_pre, alarme_nivel_tens_pre, alarme_pre_enabled FROM AlarmeConfig", function (err, rows) {
            var alarmesConfig = [];
            rows.forEach(function row(row) {
                alarmesConfig.push(new createAlarmeConfig(row.id, row.tipo_modulo, row.nivel_alert_tensao_max, row.nivel_alert_tensao_min, row.nivel_alert_temp_max, row.nivel_alert_temp_min,
                    row.nivel_alert_impedancia_max, row.nivel_alert_impedancia_min, row.nivel_max_tensao_ativo == 1 ? true : false, row.nivel_max_tensao_val,
                    row.alarme_nivel_tensao_max, row.alarme_nivel_tensao_min, row.alarme_nivel_temp_max, row.alarme_nivel_temp_min,
                    row.alarme_nivel_imped_max, row.alarme_nivel_imped_min, row.alarme_nivel_tensaoBarr_max, row.alarme_nivel_tensaoBarr_min, row.alarme_nivel_target_max,
                    row.alarme_nivel_target_min,
                    row.alarme_nivel_imped_pre,
                    row.alarme_nivel_temp_pre,
                    row.alarme_nivel_tens_pre,
                    row.alarme_pre_enabled));
            });
            data(err, alarmesConfig);
        });
    db.close();
}
var getById = function (id, data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.get("SELECT id, tipo_modulo, nivel_alert_tensao_max, nivel_alert_tensao_min, nivel_alert_temp_max, nivel_alert_temp_min, nivel_alert_impedancia_max, " +
        "nivel_alert_impedancia_min, nivel_max_tensao_ativo, nivel_max_tensao_val, alarme_nivel_tensao_max, alarme_nivel_tensao_min, " +
        "alarme_nivel_temp_max, alarme_nivel_temp_min, alarme_nivel_imped_max, alarme_nivel_imped_min, alarme_nivel_tensaoBarr_max, " +
        "alarme_nivel_tensaoBarr_min, alarme_nivel_target_max, alarme_nivel_target_min, alarme_nivel_imped_pre, alarme_nivel_temp_pre, alarme_nivel_tens_pre, alarme_pre_enabled FROM AlarmeConfig WHERE id = $id", { $id: id }, function (err, row) {
            if (row) {
                var alarmeConfig = new createAlarmeConfig(row.id, row.tipo_modulo, row.nivel_alert_tensao_max, row.nivel_alert_tensao_min, row.nivel_alert_temp_max, row.nivel_alert_temp_min,
                    row.nivel_alert_impedancia_max, row.nivel_alert_impedancia_min, row.nivel_max_tensao_ativo == 1 ? true : false, row.nivel_max_tensao_val,
                    row.alarme_nivel_tensao_max, row.alarme_nivel_tensao_min, row.alarme_nivel_temp_max, row.alarme_nivel_temp_min,
                    row.alarme_nivel_imped_max, row.alarme_nivel_imped_min, row.alarme_nivel_tensaoBarr_max, row.alarme_nivel_tensaoBarr_min, row.alarme_nivel_target_max,
                    row.alarme_nivel_target_min,
                    row.alarme_nivel_imped_pre,
                    row.alarme_nivel_temp_pre,
                    row.alarme_nivel_tens_pre,
                    row.alarme_pre_enabled);
                console.log(alarmeConfig);
                data(err, alarmeConfig);
            }
            else
                data(err, null);
        });
    db.close();
}
var update = function (alarmeConfig) {
    getAll(function (err, alarmesConfig) {
        if (alarmesConfig.length <= 0) {
            save(alarmeConfig);
            return;
        }
    });
    console.log(alarmeConfig);
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.run("UPDATE AlarmeConfig SET tipo_modulo = $tipo_modulo, nivel_alert_tensao_max = $nivel_alert_tensao_max, nivel_alert_tensao_min = $nivel_alert_tensao_min, nivel_alert_temp_max = $nivel_alert_temp_max, nivel_alert_temp_min = $nivel_alert_temp_min, nivel_alert_impedancia_max = $nivel_alert_impedancia_max, " +
        "nivel_alert_impedancia_min = $nivel_alert_impedancia_min, nivel_max_tensao_ativo = $nivel_max_tensao_ativo, nivel_max_tensao_val = $nivel_max_tensao_val, alarme_nivel_tensao_max = $alarme_nivel_tensao_max, alarme_nivel_tensao_min = $alarme_nivel_tensao_min, " +
        "alarme_nivel_temp_max = $alarme_nivel_temp_max, alarme_nivel_temp_min = $alarme_nivel_temp_min, alarme_nivel_imped_max = $alarme_nivel_imped_max, alarme_nivel_imped_min = $alarme_nivel_imped_min, alarme_nivel_tensaoBarr_max = $alarme_nivel_tensao_barr_max, " +
        "alarme_nivel_tensaoBarr_min = $alarme_nivel_tensao_barr_min, alarme_nivel_target_max = $alarme_nivel_target_max, alarme_nivel_target_min = $alarme_nivel_target_min, " +
        "alarme_nivel_imped_pre = $alarme_nivel_imped_pre, " +
        "alarme_nivel_temp_pre = $alarme_nivel_temp_pre, " +
        "alarme_nivel_tens_pre = $alarme_nivel_tens_pre, " +
        "alarme_pre_enabled = $alarme_pre_enabled " +
        "WHERE id = $id", {
            $id: alarmeConfig.id,
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
            $alarme_nivel_imped_min: alarmeConfig.alarme_nivel_imped_min,
            $alarme_nivel_tensao_barr_max: alarmeConfig.alarme_nivel_tensao_barr_max,
            $alarme_nivel_tensao_barr_min: alarmeConfig.alarme_nivel_tensao_barr_min,
            $alarme_nivel_target_max: alarmeConfig.alarme_nivel_target_max,
            $alarme_nivel_target_min: alarmeConfig.alarme_nivel_target_min,
            $alarme_nivel_imped_pre: alarmeConfig.alarme_nivel_imped_pre,
            $alarme_nivel_temp_pre: alarmeConfig.alarme_nivel_temp_pre,
            $alarme_nivel_tens_pre: alarmeConfig.alarme_nivel_tens_pre,
            $alarme_pre_enabled: alarmeConfig.alarme_pre_enabled ? 1 : 0,
        });
    db.close();
}
module.exports.save = save;
module.exports.createAlarmeConfig = createAlarmeConfig;
module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.update = update;
