var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var createTendence = function (is_on, install_date, zero_date_months,
    period_date_months, impe_min, impe_max, temp_min, temp_max, testMode) 
    {
        return {
            is_on: is_on != 0 ? true : false,
            install_date: install_date,
            zero_date_months: zero_date_months,
            period_date_months: period_date_months,
            impe_min: impe_min,
            impe_max: impe_max,
            temp_min: temp_min,
            temp_max: temp_max,
            testMode: testMode != 0 ? true : false,
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
                    strSql = "SELECT dataInstalacao, dataZero, period, impMax, impMin, tempMin, tempMax, isOn, testMode FROM TendenciasConfig LIMIT 1;"
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
                                data[0].tempMax,
                                data[0].testMode
                                ));
                            }
                        });
                    }
                }
            });
        }
        
        function linearize_get(data, iteration, batcount){
            var response = [];
            var initial = [];
            for(var i = 0; i < batcount; i += 1){
                for(var j = 0; j < iteration; j += 1){
                    var index = i + j * batcount;
                    var batdata = data[index];
                    if(j == 0){
                        initial.push(batdata);
                    }else{
                        var fval = parseFloat(initial[i].impedancia);
                        var cval = parseFloat(batdata.impedancia);
                        batdata.deltaImpedancia = ((cval - fval) / fval)*100.0;
                        fval = parseFloat(initial[i].temperatura);
                        cval = parseFloat(batdata.temperatura);
                        batdata.deltaTemperatura = ((cval - fval) / fval)*100.0;
                    }
                    response.push(batdata);
                }
            }
            
            response = {data: response, iterations: iteration, batterycount: batcount};
            return response;
        }
        
        function linearize_get_strings(data, iteration, batcount){
            var _response = [];
            var initial = [];

            for(var i = 0; i < batcount; i += 1){
                for(var j = 0; j < iteration; j += 1){
                    var index = i + j * batcount;
                    var batdata = data[index];
                    if(j == 0){
                        initial.push(batdata);
                    }else{
                        var fval = parseFloat(initial[i].impedancia);
                        var cval = parseFloat(batdata.impedancia);
                        batdata.deltaImpedancia = ((cval - fval) / fval)*100.0;
                        fval = parseFloat(initial[i].temperatura);
                        cval = parseFloat(batdata.temperatura);
                        batdata.deltaTemperatura = ((cval - fval) / fval)*100.0;
                    }
                    _response.push(batdata);
                }
            }
            
            /* Separa os dados em strings */
            var i = 0;
            var l = _response.length;
            var separated = [];
            var indexes = [];
            var output = [];
            var flags = [];
            for (i=0; i<l; i++) {
                /* Flavio Alves: nao entendi direito (ainda) a logica,
                * entao estou copiando o que foi feito no status dos 
                * modulos */
                var vi = indexes.indexOf(_response[i].string);
                if(!(vi > -1)){
                    indexes.push(_response[i].string);
                    vi = indexes.indexOf(_response[i].string);
                    separated[vi] = [];
                }
                
                separated[vi].push(_response[i]);
                if (flags[_response[i].string]){
                    continue;
                }
                flags[_response[i].string] = true;
                output.push(_response[i].string);
            }

            console.log("FLAVIO ALVES: separated len = " + separated.length);
            l = separated.length;
            batcount = batcount / l;
            var response = [];
            for (i=0; i<l; i++) {
                var _respItem = { 
                    data: separated[i], 
                    stringName: indexes[i],
                    iterations: iteration, 
                    batterycount: batcount 
                };
                response.push(_respItem);
            }

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
                                iteration from Tendencias ORDER BY iteration, CAST(SUBSTR(bateria, 2, length(bateria)) as integer);";
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
        
        var get_data_strings = function(dataCallback, errCallback){
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
                    if(iteration == null) {
                        errCallback(err);
                    } else {
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
                                    iteration from Tendencias ORDER BY iteration, CAST(SUBSTR(bateria, 2, length(bateria)) as integer);";
                                    db.all(strsql, function(err3, data3){
                                        if(err3){
                                            console.log("Error:");
                                            console.log(err3);
                                            errCallback(err3);
                                        }else{
                                            dataCallback(linearize_get_strings(data3, iteration, batCount));
                                        }
                                    });
                                }
                            });
                        }else{
                            dataCallback(linearize_get_strings([], 1, 1));
                        }
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
                        statement = db.prepare("UPDATE TendenciasConfig SET dataInstalacao = ?, dataZero = ?, period = ?, impMin = ?, impMax = ?, tempMin = ?, tempMax = ?, isOn = ?, testMode = ?;");
                    }else{
                        console.log("First configuration running");
                        statement = db.prepare("INSERT INTO TendenciasConfig (dataInstalacao, dataZero, period, impMin, impMax, tempMin, tempMax, isOn, lastIteration, testMode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?);");
                    }
                    
                    statement.run(parameters.install_date, parameters.zero_date_months, 
                        parameters.period_date_months, parameters.impe_min,
                        parameters.impe_max, parameters.temp_min, parameters.temp_max, parameters.is_on, parameters.testMode);
                    }
                });
            }
            
            var clear = function(errCallback){
                console.log("Limpando tabela de tendencias");
                var db = new sqlite3.Database('equalizerdb');
                db.run('PRAGMA busy_timeout = 60000;');
                db.run('PRAGMA journal_mode=WAL;');
                db.run('DELETE FROM Tendencias;');
                console.log("Tabela de tendencias limpa");
                db.run('UPDATE TendenciasConfig SET lastData=\"\";');
                db.run('UPDATE TendenciasConfig SET zeroFilled=0;');
                db.run('UPDATE TendenciasConfig SET lastIteration=0;');
                console.log("Configuracoes de Tendecias resetadas");
            }
            
            module.exports.get = get;
            module.exports.get_data = get_data;
            module.exports.get_data_strings = get_data_strings;
            module.exports.createTendenceZero = createZeroTendence;
            module.exports.createTendence = createTendence;
            module.exports.persist = persist;
            module.exports.clear = clear;
            