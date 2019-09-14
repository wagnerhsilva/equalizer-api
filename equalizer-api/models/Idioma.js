var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');
var fs = require('fs');

var getLast = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.get("SELECT idioma FROM Idioma LIMIT 1", function (err, row) {
        if (row) {
            var lang = new createIdioma(row.idioma);
            console.log(lang);
            data(err, lang);
        }
        else
            data(err, null);
    });
    db.close();
}

var getLanguage = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.get("SELECT idioma FROM Idioma LIMIT 1", function (err, row) {
        if (row) {
            var lang = new createIdioma(row.idioma);
            console.log(lang);
            data(err, lang);
        } else {
            data(err, null);
        }
        
    });
    db.close();
}

var update = function (idioma) {
    console.log("Update idioma");
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.run("UPDATE Idioma SET idioma = $idioma"
        , {
            $idioma: idioma.idioma
        });
    db.close();
}

var createIdioma = function (idioma) {
    return {
        idioma: idioma
    }
}

module.exports.update = update;
module.exports.getLast = getLast;
module.exports.createIdioma = createIdioma;
module.exports.getLanguage = getLanguage;