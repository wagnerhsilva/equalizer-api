var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');
var fs = require('fs');

var SSH_DISABLED = "ssh.disabled"

var touch_file = function(filepath){
    fs.closeSync(fs.openSync(filepath, 'w'));
}

var remove_file = function(filepath){
    fs.unlinkSync(filepath);
}

var file_exists = function(filepath){
    return fs.existsSync(filepath);
}

var SSH_handle = function(ssh_enabled){
    cmd = ""
    should_run = true;
    fileExists = file_exists(SSH_DISABLED);
    if(!ssh_enabled && !fileExists){
        touch_file(SSH_DISABLED);
        cmd = "/etc/init.d/sshd stop && update-rc.d -f -v sshd remove";
    }else if(ssh_enabled && fileExists){
        remove_file(SSH_DISABLED);
        cmd = "update-rc.d -f -v sshd defaults && /etc/init.d/sshd start";
    }else{
        should_run = false;
    }
    
    if(should_run){
        require('child_process').exec(cmd, (err, stdout, stderr) => {
            if(err){
                console.log(err);
            }
        });
    }
}

var createParameters = function (duty_min, duty_max, delay, num_cycles_var_read, save_log_time, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, CheckboxCurrent, SshDisabled) {
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
        param10: param10,
        CheckboxCurrent: CheckboxCurrent,
        ssh_enabled: !SshDisabled,
        ssh_title: SshDisabled ? "Desativado" : "Ativado"
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
    SSH_handle(parameter.ssh_enabled);
}

var updateTrap = function(parameter){
    console.log("Update Trap");
    console.log(parameter);
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.run("UPDATE Parameters SET param4 = $param4, param5 = $param5, param6 = $param6, param7 = $param7"
        , {
            $param4: parameter.param4,
            $param5: parameter.param5,
            $param6: parameter.param6,
            $param7: parameter.param7
        });
    db.close();
}

var getTrap = function(data){
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.get("SELECT param4, param5, param6, param7 FROM Parameters LIMIT 1", function (err, row) {
        if (row) {
            var parameter = { param4: row.param4, 
                            param5: row.param5, 
                            param6: row.param6, 
                            param7: row.param7};
            data(err, parameter);
        }
        else
            data(err, null);
    });
    db.close();
}

var getLast = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.get("SELECT duty_min, duty_max, delay, num_cycles_var_read, save_log_time, param1, param2, param3, param4, param5,"
                            +" param6, param7, param8, param9, param10, CheckboxCurrent FROM Parameters LIMIT 1", function (err, row) {
        if (row) {
            var IsFilePresent = file_exists(SSH_DISABLED);
            var parameter = new createParameters(row.duty_min, row.duty_max, row.delay, row.num_cycles_var_read, row.save_log_time, row.param1, row.param2, 
                                                    row.param3, row.param4, row.param5, row.param6, row.param7, row.param8, row.param9, row.param10, row.CheckboxCurrent, IsFilePresent);
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
                                    +" save_log_time = $save_log_time, param1 = $param1, param2 = $param2, param3 = $param3,"
                                    +" param8 = $param8, param9 = $param9, param10 = $param10"
        , {
            $duty_min: parameter.duty_min,
            $duty_max: parameter.duty_max,
            $delay: parameter.delay,
            $num_cycles_var_read: parameter.num_cycles_var_read,
            $save_log_time: parameter.save_log_time,
            $param1: parameter.param1,
            $param2: parameter.param2,
            $param3: parameter.param3,
            $param8: parameter.param8,
            $param9: parameter.param9,
            $param10: parameter.param10
        });
    db.close();
    SSH_handle(parameter.ssh_enabled);
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

var HabilitaCorrente = function(){
    console.log("Habilita leitura de corrente");
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.run("UPDATE Parameters SET CheckboxCurrent = '1';");
    db.close();
}
var ReabilitaCorrente = function(){
    console.log("Desabilita leitura de corrente.");
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.run("UPDATE Parameters SET CheckboxCurrent = '0';");
    db.close();
}

var HabLeituraImp = function(){
    console.log("Faz leitura de impedância.");
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.run("UPDATE Parameters SET ReadImpedance = '1';");
    db.close();
}

module.exports.save = save;
module.exports.createParameters = createParameters;
module.exports.getLast = getLast;
module.exports.update = update;
module.exports.updateTrap = updateTrap;
module.exports.getTrap = getTrap;
module.exports.zerarDutyMax = zerarDutyMax;
module.exports.voltarDutyMax = voltarDutyMax;
module.exports.HabilitaCorrente = HabilitaCorrente;
module.exports.ReabilitaCorrente = ReabilitaCorrente;
module.exports.HabLeituraImp = HabLeituraImp;
