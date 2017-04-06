var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

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
    var db = new sqlite3.Database('equalizerdb');
    var stmt = db.prepare("INSERT INTO Usuario(nome, sobreNome, telefone, email, senha, acesso) VALUES (?,?,?,?,?,?)");
    stmt.run(user.nome, user.sobreNome, user.telefone, user.email, user.senha, user.acesso, function (error) {
        if (error)
            err(error);
        else
            err(false);
    });
    stmt.finalize();
    db.close();
}
var getAll = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.all("SELECT id, nome, sobreNome, telefone, email, senha, acesso FROM Usuario", function (err, rows) {
        var users = [];
        rows.forEach(function row(row) {
            users.push(new createUser(row.id, row.nome, row.sobreNome, row.telefone, row.email, row.senha, row.acesso));
        });
        data(err, users);
    });
    db.close();
}
var getById = function (id, data) {
    var db = new sqlite3.Database('equalizerdb');
    db.get("SELECT id, nome, sobreNome, telefone, email, senha, acesso FROM Usuario WHERE id = $id", { $id: id }, function (err, row) {
        if (row) {
            var user = new createUser(row.id, row.nome, row.sobreNome, row.telefone, row.email, row.senha, row.acesso);
            console.log(user);
            data(err, user);
        }
        else
            data(err, null);
    });
    db.close();
}
var updateAcesso = function (user) {
    var db = new sqlite3.Database('equalizerdb');
    db.run("UPDATE Usuario SET acesso = $acesso WHERE id = $id", { $id: user.id, $acesso: user.acesso });
    db.close();
}
var update = function (user) {
    var db = new sqlite3.Database('equalizerdb');
    db.run("UPDATE Usuario SET nome = $nome, sobreNome = $sobreNome, telefone = $telefone, email = $email, senha = $senha, acesso = $acesso " +
                "WHERE id = $id", { $id: user.id, 
                                    $nome: user.nome, 
                                    $sobreNome: user.sobreNome, 
                                    $telefone: user.telefone, 
                                    $email: user.email, 
                                    $senha: createHash(user.senha), 
                                    $acesso: user.acesso });
    db.close();
}
var getByEmail = function (email, data) {
    var db = new sqlite3.Database('equalizerdb');
    db.get("SELECT id, nome, sobreNome, telefone, email, senha, acesso FROM Usuario WHERE email = $email", { $email: email }, function (err, row) {
        if (row) {
            var user = new createUser(row.id, row.nome, row.sobreNome, row.telefone, row.email, row.senha, row.acesso);
            console.log(user);
             data(err, user);
        }
        else
            data(null);
    });
    db.close();
}
var deleteUser = function (id) {
    var db = new sqlite3.Database('equalizerdb');
    console.log("Id do Usuario: "+ id);
    db.run("DELETE FROM Usuario WHERE id = $id", { $id: id });
    db.close();
}

 var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
module.exports.save = save;
module.exports.createUser = createUser;
module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.getByEmail = getByEmail;
module.exports.updateAcesso = updateAcesso;
module.exports.update = update;
module.exports.delete = deleteUser;