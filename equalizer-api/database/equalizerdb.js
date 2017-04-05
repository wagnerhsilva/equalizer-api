var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('equalizerdb');
var init = function () {
    console.log("Criando DB");
    db.serialize(function () {
        db.run("CREATE TABLE IF NOT EXISTS Usuario (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, sobreNome TEXT, telefone TEXT, email TEXT, senha TEXT, acesso TEXT)");
    });
    db.close();
};
module.exports.init = init;