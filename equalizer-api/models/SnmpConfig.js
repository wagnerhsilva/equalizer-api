var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var do_snmp_off = function(callback){
    console.log("Trying to turn SNMP off...");
    var exec = require('child_process').exec;
    var cmd = '/etc/init.d/snmpd stop';
    console.log("Running " + cmd);
    exec(cmd, function (error, stdout, stderr) {
        if (error) {
            console.error(error);
            return;
        }
        cmd = '/etc/init.d/equalizer-traps stop';
        console.log("Running " + cmd);
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                console.error(error);
                return;
            }
            callback();
        });
    });    
}

var do_snmp_on = function(callback){
    console.log("Trying to start SNMP...");
    var exec = require('child_process').exec;
    var cmd = '/etc/init.d/snmpd start';
    console.log("Running " + cmd);
    exec(cmd, function (error, stdout, stderr) {
        if (error) {
            console.error(error);
            return;
        }
        cmd = '/etc/init.d/equalizer-traps start';
        console.log("Running " + cmd);
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                console.error(error);
                return;
            }
            console.log("SNMP setup finished!");
            callback();
        });
    });    
}

var do_snmp_trigger = function(currentConfig){
    if(currentConfig.is_on){
        var restarting = function(){
            console.log("Trying to configure SNMP...");
            var exec = require('child_process').exec;
            var cmd = '';
            if(currentConfig.version == 0){
                cmd = "python /var/www/equalizer-agent/set_v1v2.py";
            }else{
                cmd = "python /var/www/equalizer-agent/set_v3.py";
            }
            console.log("Running " + cmd);
            exec(cmd, function(error, stdout, stderr){
                if(error){
                    console.log(error);
                    return;
                }else{
                    console.log("OK!");
                }
                var successFunction = function(){
                    console.log("SNMP restarted");
                };

                do_snmp_on(successFunction);
            });
        };
        do_snmp_off(restarting);
    }else{
        var turnedOff = function(){
            console.log("SNMP turned off");
        };
        do_snmp_off(turnedOff);
    }
    
}

var createTrap = function(id, addr, comm){
    return {
        id: id, 
        addr:addr, 
        comm:comm
    }
}

var createCommunity = function(id, addr, comm, perm){
    return {
        id: id,
        addr: addr,
        comm: comm,
        perm: perm
    }
}

var createConfiguration = function(id, is_on, version, auth, user, pass, traps, communities, param5, param6, param7){
    return {
        id: id,
        is_on: is_on ? true : false,
        version: version,
        auth: auth,
        user: user,
        pass: pass,
        traps: traps,
        comm: communities,
        param5: param5,
        param6: param6,
        param7: param7
    }    
}


var getAll = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.all("SELECT * from SnmpCommunities LIMIT 5", function(CommErr, CommRows){
        var communities = [];
        
        CommRows.forEach(function CommRow(CommRow){
            communities.push(new createCommunity(CommRow.id, CommRow.Address, CommRow.Community, CommRow.Permission));
        });

        db.all("SELECT * from SnmpTraps LIMIT 5", function(TrapErr, TrapRows){
            var traps = [];
            TrapRows.forEach(function TrapRows(TrapRows){
                traps.push(new createTrap(TrapRows.id, TrapRows.Address, TrapRows.Community));
            });

            db.all("SELECT param5, param6, param7 FROM Parameters", function(PErr, pRows){
                var rr = pRows[0];
                db.all("SELECT * from SnmpCfgs LIMIT 1", function(error, rows){
                    var response = createConfiguration(rows[0].id, rows[0].Running, rows[0].Version,
                                                      rows[0].Security, rows[0].User, rows[0].Pass, 
                                                      traps, communities, rr.param5, rr.param6, rr.param7);
                    data(error, response);
                });
            });
        });
    });

    db.close();
}

var update = function (newCfg) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    var traps = newCfg.traps;
    var comm = newCfg.comm;
    var is_on = newCfg.is_on ? 1 : 0;
    var cmd = "UPDATE SnmpCfgs SET Running = " + is_on + ", Version = " + newCfg.version + ", Security = " + newCfg.auth + ", User = \"" + newCfg.user + "\", Pass = \"" + newCfg.pass + "\"";
    db.run(cmd);

    traps.forEach(function Trap(trap){
        cmd = "UPDATE SnmpTraps SET Address = \"" + trap.addr + "\", Community = \"" + trap.comm + "\" WHERE id = " + trap.id;
        db.run(cmd);
    });

    comm.forEach(function Comm(comm){
        let perm = parseInt(comm.perm);
        cmd = "UPDATE SnmpCommunities SET Address = \"" + comm.addr + "\", Community = \"" + comm.comm + "\", Permission = " + perm + " WHERE id = " + comm.id;
        db.run(cmd);
    });

    cmd = "UPDATE Parameters SET param5 = " + newCfg.param5 + ", param6 = " + newCfg.param6 + ", param7 = " + newCfg.param7;

    db.run(cmd);
    
    do_snmp_trigger(newCfg);
    
    db.close();
}

var init_snmp = function(){
    getAll(function(err, snmpconfig){
        if(err){
            console.log(err);
            return next(err);
        }

        do_snmp_trigger(snmpconfig);
    });
}

module.exports.init_snmp = init_snmp;
module.exports.getAll = getAll;
module.exports.update = update;
module.exports.createCommunity = createCommunity;
module.exports.createTrap = createTrap;
module.exports.createConfiguration = createConfiguration;