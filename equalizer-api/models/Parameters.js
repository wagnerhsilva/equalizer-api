var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var createParameters = function (duty_min, duty_max, delay, num_cycles_var_read, save_log_time ) {
    return {
        duty_min: duty_min,
        duty_max: duty_max,
        delay: delay,
        num_cycles_var_read: num_cycles_var_read,
        save_log_time: save_log_time
    }
}
var save = function (parameter, err) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    var stmt = db.prepare("INSERT INTO Parameters(duty_min, duty_max, delay, num_cycles_var_read, save_log_time) VALUES (?, ?, ?, ?, ?)");
    stmt.run(parameter.duty_min, parameter.duty_max, parameter.delay, parameter.num_cycles_var_read, parameter.save_log_time, function (error) {
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
    db.get("SELECT duty_min, duty_max, delay, num_cycles_var_read, save_log_time FROM Parameters LIMIT 1", function (err, row) {
        if (row) {
            var parameter = new createParameters(row.duty_min, row.duty_max, row.delay, row.num_cycles_var_read, row.save_log_time);
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
    db.run("UPDATE Parameters SET duty_min = $duty_min, duty_max = $duty_max, delay = $delay, num_cycles_var_read = $num_cycles_var_read, save_log_time = $save_log_time"
        , {
            $duty_min: parameter.duty_min,
            $duty_max: parameter.duty_max,
            $delay: parameter.delay,
            $num_cycles_var_read: parameter.num_cycles_var_read,
            $save_log_time: parameter.save_log_time
        });
    db.close();
}

module.exports.save = save;
module.exports.createParameters = createParameters;
module.exports.getLast = getLast;
module.exports.update = update;