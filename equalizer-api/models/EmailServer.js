var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var createEmailServer = function (id, server, portaSMTP, usarCriptografiaTLS, email, assunto, usarAutenticacao, login, senha) {
    return {
        id: id,
        server: server,
        portaSMTP: portaSMTP,
        usarCriptografiaTLS: usarCriptografiaTLS,
        email: email,
        assunto: assunto,
        usarAutenticacao: usarAutenticacao,
        login: login,
        senha: senha
    }
}
var save = function (emailServer) {
    var db = new sqlite3.Database('equalizerdb');
    var stmt = db.prepare("INSERT INTO EmailServer(server, portaSMTP, usarCriptografiaTLS, email, assunto, usarAutenticacao, login, senha) VALUES (?,?,?,?,?,?,?,?)");
    stmt.run(emailServer.server, emailServer.portaSMTP, emailServer.usarCriptografiaTLS, emailServer.email, emailServer.assunto, emailServer.usarAutenticacao, emailServer.login, emailServer.senha);
    stmt.finalize();
    db.close();
}
var getAll = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.all("SELECT id, server, portaSMTP, usarCriptografiaTLS, email, assunto, usarAutenticacao, login, senha FROM EmailServer", function (err, rows) {
        var emailServers = [];
        rows.forEach(function row(row) {
            emailServers.push(new createEmailServer(row.id, row.server, row.portaSMTP, row.usarCriptografiaTLS, row.email, row.assunto, row.usarAutenticacao == 1 ? true : false, row.login, row.senha));
        });
        data(err, emailServers);
    });
    db.close();
}
var update = function (emailServer) {

    getAll(function (err, emailServers) {
        console.log("emailServer");
        console.log(emailServers.length);
        if (emailServers.length <= 0) {
            save(emailServer);
            return;
        }
    });
    console.log("update");
    console.log(emailServer);

    var db = new sqlite3.Database('equalizerdb');
    db.run("UPDATE EmailServer SET server = $server, portaSMTP = $portaSMTP, usarCriptografiaTLS = $usarCriptografiaTLS, email = $email, assunto = $assunto, usarAutenticacao = $usarAutenticacao, login = $login, senha = $senha " +
        "WHERE id = $id", {
            $id: emailServer.id,
            $server: emailServer.server,
            $portaSMTP: emailServer.portaSMTP,
            $usarCriptografiaTLS: emailServer.usarCriptografiaTLS,
            $email: emailServer.email,
            $assunto: emailServer.assunto,
            $usarAutenticacao: emailServer.usarAutenticacao,
            $login: emailServer.login,
            $senha: emailServer.senha
        });
    db.close();
}
module.exports.save = save;
module.exports.createEmailServer = createEmailServer;
module.exports.getAll = getAll;
module.exports.update = update;