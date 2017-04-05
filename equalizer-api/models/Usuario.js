var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('equalizerdb');

var createUser = function (id, nome, sobrenome, telefone, email, senha, acesso) {
    return {
        id: id,
        nome: nome,
        sobreNome: sobrenome,
        telefone: telefone,
        email: email,
        senha: senha,
        acesso: acesso
    }
}
var save = function (user, err) {
    var stmt = db.prepare("INSERT INTO Usuario(nome, sobreNome, telefone, email, senha, acesso) VALUES (?,?,?,?,?,?)");
    stmt.run(user.nome, user.sobreNome, user.telefone, user.email, user.senha, user.acesso, function (error) {
        if (error)
            err(error);
        else
            err(false);
    });
    stmt.finalize();
}
var getAll = function (data) {
    db.all("SELECT id, nome, sobreNome, telefone, email, senha, acesso FROM Usuario", function (err, rows) {
        var users = [];
        rows.forEach(function row(row) {
            users.push(new createUser(row.id, row.nome, row.sobreNome, row.telefone, row.email, row.senha, row.acesso));
        });
        data(err, users);
    });
}
var getById = function (id, data) {
    db.get("SELECT id, nome, sobreNome, telefone, email, senha, acesso FROM Usuario WHERE id = $id", { $id: id }, function (err, row) {
        if (row) {
            var user = new createUser(row.id, row.nome, row.sobreNome, row.telefone, row.email, row.senha, row.acesso);
            console.log(user);
            data(err, user);
        }
        else
            data(err, null);
    });
}
var updateAcesso = function (user) {
    db.run("UPDATE Usuario SET acesso = $acesso WHERE id = $id", { $id: user.id, $acesso: user.acesso });
}
var getByEmail = function (email, data) {
    db.get("SELECT id, nome, sobreNome, telefone, email, senha, acesso FROM Usuario WHERE email = $email", { $email: email }, function (err, row) {
        if (row) {
            var user = new createUser(row.id, row.nome, row.sobreNome, row.telefone, row.email, row.senha, row.acesso);
            console.log(user);
             data(err, user);
        }
        else
            data(null);
    });
}
module.exports.save = save;
module.exports.createUser = createUser;
module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.getByEmail = getByEmail;
module.exports.updateAcesso = updateAcesso;