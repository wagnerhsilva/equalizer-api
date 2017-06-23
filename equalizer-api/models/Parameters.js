var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var createParameters = function (duty_min, duty_max, delay, num_cycles_var_read, save_log_time, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
    return {
        duty_min: duty_min,
        duty_max: duty_max,
        delay: delay,
        num_cycles_var_read: num_cycles_var_read,
        save_log_time: save_log_time,
        param1: param1, 
        param2: param2, 
        param3: param3, 
        param4: param4, 
        param5: param5, 
        param6: param6, 
        param7: param7, 
        param8: param8, 
        param9: param9, 
        param10: param10
    }
}
var save = function (parameter, err) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    var stmt = db.prepare("INSERT INTO Parameters(duty_min, duty_max, delay, num_cycles_var_read, save_log_time, param1, param2, param3, param4, param5,"
                            +" param6, param7, param8, param9, param10) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    stmt.run(parameter.duty_min, parameter.duty_max, parameter.delay, parameter.num_cycles_var_read, parameter.save_log_time, parameter.param1, 
                parameter.param2, parameter.param3, parameter.param4, parameter.param5, parameter.param6, parameter.param7, parameter.param8, parameter.param9, 
                parameter.param10, function (error) {
        if (error)
            err(error);
        else
            err(false);
    });
    stmt.finalize();
    db.close();
}
var getLast = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.get("SELECT duty_min, duty_max, delay, num_cycles_var_read, save_log_time, param1, param2, param3, param4, param5,"
                            +" param6, param7, param8, param9, param10 FROM Parameters LIMIT 1", function (err, row) {
        if (row) {
            var parameter = new createParameters(row.duty_min, row.duty_max, row.delay, row.num_cycles_var_read, row.save_log_time, row.param1, row.param2, 
                                                    row.param3, row.param4, row.param5, row.param6, row.param7, row.param8, row.param9, row.param10);
            console.log(parameter);
            data(err, parameter);
        }
        else
            data(err, null);
    });
    db.close();
}
var update = function (parameter) {
    console.log("Update parameter");
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.run("UPDATE Parameters SET duty_min = $duty_min, duty_max = $duty_max, delay = $delay, num_cycles_var_read = $num_cycles_var_read," 
                                    +" save_log_time = $save_log_time, param1 = $param1, param2 = $param2, param3 = $param3, param4 = $param4,"
                                    +" param5 = $param5, param6 = $param6, param7 = $param7, param8 = $param8, param9 = $param9, param10 = $param10"
        , {
            $duty_min: parameter.duty_min,
            $duty_max: parameter.duty_max,
            $delay: parameter.delay,
            $num_cycles_var_read: parameter.num_cycles_var_read,
            $save_log_time: parameter.save_log_time,
            $param1: parameter.param1,
            $param2: parameter.param2,
            $param3: parameter.param3,
            $param4: parameter.param4,
            $param5: parameter.param5,
            $param6: parameter.param6,
            $param7: parameter.param7,
            $param8: parameter.param8,
            $param9: parameter.param9,
            $param10: parameter.param10
        });
    db.close();
}
var zerarDutyMax = function(){
    console.log("Zerando duty max...");
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.run("UPDATE Parameters SET duty_max = 0;");
    db.close();
}
var voltarDutyMax = function(){
    console.log("Zerando duty max...");
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.run("UPDATE Parameters SET duty_max = '" + global.lastDutyMax + "';");
    db.close();
}

module.exports.save = save;
module.exports.createParameters = createParameters;
module.exports.getLast = getLast;
module.exports.update = update;
module.exports.zerarDutyMax = zerarDutyMax;
module.exports.voltarDutyMax = voltarDutyMax;