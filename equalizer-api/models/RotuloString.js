var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var createRotuloString = function (string, apelido) {
    return {
        string: string,
        apelido: apelido
    }
}
var save = function (rotuloString) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    var stmt = db.prepare("INSERT INTO ApelidoString(String, Apelido) VALUES (?, ?)");
    stmt.run(rotuloString.string, rotuloString.apelido, function (error) {
    });
    stmt.finalize();
    db.close();
}
var getByString = function (string, data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;')
    db.get("SELECT String, Apelido FROM ApelidoString WHERE String = $string", { $string: string }, function (err, row) {
        if (row) {
            var rotuloString = new createRotuloString(row.String, row.Apelido);
            console.log(rotuloString);
            data(rotuloString);
        }
        else
            data(null);
    });
    db.close();
}
var update = function (rotuloString) {
    console.log("Update rotuloString");
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    db.run("UPDATE ApelidoString SET Apelido = $apelido where String = $string"
        , {
            $string: rotuloString.string,
            $apelido: rotuloString.apelido
        });
    db.close();
}

module.exports.save = save;
module.exports.getByString = getByString;
module.exports.update = update;