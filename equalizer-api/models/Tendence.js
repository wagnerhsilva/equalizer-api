var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var createTendence = function (is_on, install_date, zero_date_months,
     period_date_months, impe_min, impe_max, temp_min, temp_max) 
{
    return {
        is_on: is_on != 0 ? true : false,
        install_date: install_date,
        zero_date_months: zero_date_months,
        period_date_months: period_date_months,
        impe_min: impe_min,
        impe_max: impe_max,
        temp_min: temp_min,
        temp_max: temp_max
    }
}

var createZeroTendence = function(){
    return createTendence(0, "", 0, 0, 0, 0, 0, 0);
}

var get = function(parameters, errCallback){
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    var strSql =  "SELECT COUNT(1) FROM TendenciasConfig;";
    db.all(strSql, function(err, data){
        if(err){
            errCallback(err);
        }else{
            var value = parseInt(data[0]['COUNT(1)']);
            if(value === 0){
                parameters(createZeroTendence());
            }else{
                strSql = "SELECT dataInstalacao, dataZero, period, impMax, impMin, tempMin, tempMax, isOn FROM TendenciasConfig LIMIT 1;"
                db.all(strSql, function(err, data){
                    if(err){
                        errCallback(err);
                    }else{
                        console.log(data);
                        parameters(createTendence(
                            data[0].isOn,
                            data[0].dataInstalacao,
                            data[0].dataZero,
                            data[0].period,
                            data[0].impMin,
                            data[0].impMax,
                            data[0].tempMin,
                            data[0].tempMax
                        ));
                    }
                });
            }
        }
    });
}

function linearize_get(data, iteration, batcount){
    var response = [];
    for(var i = 0; i < batcount; i += 1){
        for(var j = 0; j < iteration; j += 1){
            var index = i + j * batcount;
            var batdata = data[index];
            response.push(batdata);
        }
    }
    response = {data: response, iterations: iteration, batterycount: batcount};
    return response;
}

var get_data = function(dataCallback, errCallback){
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    var strsql = "";
    strsql = "SELECT MAX(iteration) FROM Tendencias;"
    var maxcount = 0;
    
    db.all(strsql, function(err, data){
        if(err){
            console.log("Error:");
            console.log(err);
            errCallback(err);
        }else{
            console.log(data);
            var iteration = data[0]['MAX(iteration)'];
            if(iteration > 0){
                strsql = "SELECT COUNT(1) FROM Tendencias WHERE iteration=" + iteration.toString() + ";";
                db.all(strsql, function(err2, data2){
                    if(err2){
                        console.log("Error:");
                        console.log(err2);
                        errCallback(err2);
                    }else{
                        var batCount = data2[0]['COUNT(1)'];
                        strsql = "SELECT dataHora, string, bateria, impedancia, temperatura,\
                        iteration from Tendencias ORDER BY iteration, bateria ASC;";
                        db.all(strsql, function(err3, data3){
                            if(err3){
                                console.log("Error:");
                                console.log(err3);
                                errCallback(err3);
                            }else{
                                dataCallback(linearize_get(data3, iteration, batCount));
                            }
                        });
                    }
                });
            }else{
                dataCallback(linearize_get([], 1, 1));
            }
        }
    });
}

var persist = function(parameters, errCallback){
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    var strSql = "SELECT COUNT(1) FROM TendenciasConfig;";
    db.all(strSql, function(err, data){
        if(err){
            console.log("Error:");
            console.log(err);
            errCallback(err);
        }else{
            var value = parseInt(data[0]['COUNT(1)']);
            var statement;
            if(value > 0){
                console.log("Updating configuration");
                statement = db.prepare("UPDATE TendenciasConfig SET dataInstalacao = ?, dataZero = ?, period = ?, impMin = ?, impMax = ?, tempMin = ?, tempMax = ?, isOn = ?;");
            }else{
                console.log("First configuration running");
                statement = db.prepare("INSERT INTO TendenciasConfig (dataInstalacao, dataZero, period, impMin, impMax, tempMin, tempMax, isOn, lastIteration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0);");
            }

            statement.run(parameters.install_date, parameters.zero_date_months, 
            parameters.period_date_months, parameters.impe_min,
            parameters.impe_max, parameters.temp_min, parameters.temp_max, parameters.is_on);
        }
    });
}
module.exports.get = get;
module.exports.get_data = get_data;
module.exports.createTendenceZero = createZeroTendence;
module.exports.createTendence = createTendence;
module.exports.persist = persist;