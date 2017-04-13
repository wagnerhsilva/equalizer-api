var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var createTimeServer = function (id, timeServerAddress1, timeServerAddress1_complemento, timeServerAddress2, timeServerAddress2_complemento, timeServerAddress3, timeServerAddress3_complemento, connectionRetries, timeZone, automAdjustTimeDaylightSavingChanges) {
    return {
        id: id, 
        timeServerAddress1: timeServerAddress1, 
        timeServerAddress1_complemento: timeServerAddress1_complemento, 
        timeServerAddress2: timeServerAddress2, 
        timeServerAddress2_complemento: timeServerAddress2_complemento, 
        timeServerAddress3: timeServerAddress3, 
        timeServerAddress3_complemento: timeServerAddress3_complemento, 
        connectionRetries: connectionRetries, 
        timeZone: timeZone, 
        automAdjustTimeDaylightSavingChanges: automAdjustTimeDaylightSavingChanges
    }
}
var save = function (timeServer) {
    var db = new sqlite3.Database('equalizerdb');
    var stmt = db.prepare("INSERT INTO TimeServer(timeServerAddress1, timeServerAddress1_complemento, timeServerAddress2, timeServerAddress2_complemento, timeServerAddress3, " + 
                            "timeServerAddress3_complemento, connectionRetries, timeZone, automAdjustTimeDaylightSavingChanges) VALUES (?,?,?,?,?,?,?,?,?)");
    stmt.run(timeServer.timeServerAddress1, timeServer.timeServerAddress1_complemento, timeServer.timeServerAddress2, timeServer.timeServerAddress2_complemento, timeServer.timeServerAddress3, 
                timeServer.timeServerAddress3_complemento, timeServer.connectionRetries, timeServer.timeZone, timeServer.automAdjustTimeDaylightSavingChanges);
    stmt.finalize();
    db.close();
}
var getAll = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.all("SELECT id, timeServerAddress1, timeServerAddress1_complemento, timeServerAddress2, timeServerAddress2_complemento, timeServerAddress3, timeServerAddress3_complemento, "+
                "connectionRetries, timeZone, automAdjustTimeDaylightSavingChanges FROM TimeServer", function (err, rows) {
        var timeServers = [];
        rows.forEach(function row(row) {
            timeServers.push(new createTimeServer(row.id, row.timeServerAddress1, row.timeServerAddress1_complemento, row.timeServerAddress2, row.timeServerAddress2_complemento, row.timeServerAddress3, 
                                            row.timeServerAddress3_complemento, row.connectionRetries, row.timeZone, row.automAdjustTimeDaylightSavingChanges == 1 ? true : false));
        });
        data(err, timeServers);
    });
    db.close();
}
var getById = function (id, data) {
    var db = new sqlite3.Database('equalizerdb');
    db.get("SELECT id, timeServerAddress1, timeServerAddress1_complemento, timeServerAddress2, timeServerAddress2_complemento, timeServerAddress3, timeServerAddress3_complemento, "+
                "connectionRetries, timeZone, automAdjustTimeDaylightSavingChanges FROM TimeServer WHERE id = $id", { $id: id }, function (err, row) {
        if (row) {
            var timeServer = new createTimeServer(row.id, row.timeServerAddress1, row.timeServerAddress1_complemento, row.timeServerAddress2, row.timeServerAddress2_complemento, row.timeServerAddress3, 
                                            row.timeServerAddress3_complemento, row.connectionRetries, row.timeZone, row.automAdjustTimeDaylightSavingChanges == 1 ? true : false);
            console.log(timeServer);
            data(err, timeServer);
        }
        else
            data(err, null);
    });
    db.close();
}
var update = function (timeServer) {
    
    getAll(function(err, timeServers){
        console.log("timeServers");
        console.log(timeServers.length);
        if(timeServers.length <= 0){
            save(timeServer);
            return;
        }
    });
    console.log("update");
    console.log(timeServer);
    
    var db = new sqlite3.Database('equalizerdb');
    db.run("UPDATE TimeServer SET timeServerAddress1 = $timeServerAddress1, timeServerAddress1_complemento = $timeServerAddress1_complemento, timeServerAddress2 = $timeServerAddress2, "+
                    "timeServerAddress2_complemento = $timeServerAddress2_complemento, timeServerAddress3 = $timeServerAddress3, timeServerAddress3_complemento = $timeServerAddress3_complemento, "+
                    "connectionRetries = $connectionRetries, timeZone = $timeZone, automAdjustTimeDaylightSavingChanges = $automAdjustTimeDaylightSavingChanges " +
                "WHERE id = $id", { $id: timeServer.id, 
                                    $timeServerAddress1: timeServer.timeServerAddress1, 
                                    $timeServerAddress1_complemento: timeServer.timeServerAddress1_complemento, 
                                    $timeServerAddress2: timeServer.timeServerAddress2, 
                                    $timeServerAddress2_complemento: timeServer.timeServerAddress2_complemento, 
                                    $timeServerAddress3: timeServer.timeServerAddress3, 
                                    $timeServerAddress3_complemento: timeServer.timeServerAddress3_complemento, 
                                    $connectionRetries: timeServer.connectionRetries, 
                                    $timeZone: timeServer.timeZone, 
                                    $automAdjustTimeDaylightSavingChanges: timeServer.automAdjustTimeDaylightSavingChanges });
    db.close();
}
module.exports.save = save;
module.exports.createTimeServer = createTimeServer;
module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.update = update;