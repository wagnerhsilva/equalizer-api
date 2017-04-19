var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var createModulo = function (id, descricao, tensao_nominal, capacidade_nominal, n_strings, n_baterias_por_strings, contato, localizacao, fabricante, tipo, data_instalacao, conf_alarme_id) {
    return {
        id: id,
        descricao: descricao,
        tensao_nominal: tensao_nominal,
        capacidade_nominal: capacidade_nominal,
        n_strings: n_strings,
        n_baterias_por_strings: n_baterias_por_strings,
        contato: contato,
        localizacao: localizacao,
        fabricante: fabricante,
        tipo: tipo,
        data_instalacao: data_instalacao,
        conf_alarme_id: conf_alarme_id
    }
}
var save = function (modulo) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000');
    db.run('PRAGMA journal_mode=WAL;');
    var stmt = db.prepare("INSERT INTO Modulo(descricao, tensao_nominal, capacidade_nominal, n_strings, n_baterias_por_strings, contato, localizacao, fabricante, " +
                            "tipo, data_instalacao, conf_alarme_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
    stmt.run(modulo.descricao, modulo.tensao_nominal, modulo.capacidade_nominal, modulo.n_strings, modulo.n_baterias_por_strings, modulo.contato, modulo.localizacao, modulo.fabricante, 
                modulo.tipo, modulo.data_instalacao, modulo.conf_alarme_id);
    stmt.finalize();
    db.close();
}
var getAll = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000');
    db.run('PRAGMA journal_mode=WAL;');
    db.all("SELECT id, descricao, tensao_nominal, capacidade_nominal, n_strings, n_baterias_por_strings, contato, localizacao, fabricante, tipo, data_instalacao, conf_alarme_id " +
            "FROM Modulo", function (err, rows) {
        var modulos = [];
        rows.forEach(function row(row) {
            modulos.push(new createModulo(row.id, row.descricao, row.tensao_nominal, row.capacidade_nominal, row.n_strings, row.n_baterias_por_strings, row.contato, row.localizacao, 
                                            row.fabricante, row.tipo, row.data_instalacao, row.conf_alarme_id));
        });
        data(err, modulos);
    });
    db.close();
}
var getById = function (id, data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000');
    db.run('PRAGMA journal_mode=WAL;');
    db.get("SELECT id, descricao, tensao_nominal, capacidade_nominal, n_strings, n_baterias_por_strings, contato, localizacao, fabricante, tipo, data_instalacao, conf_alarme_id " +
            "FROM Modulo WHERE id = $id", { $id: id }, function (err, row) {
        if (row) {
            var modulo = new createModulo(row.id, row.descricao, row.tensao_nominal, row.capacidade_nominal, row.n_strings, row.n_baterias_por_strings, row.contato, row.localizacao, 
                                            row.fabricante, row.tipo, row.data_instalacao, row.conf_alarme_id);
            console.log(modulo);
            data(err, modulo);
        }
        else
            data(err, null);
    });
    db.close();
}
var update = function (modulo) {
    console.log("update");
    getAll(function(err, modulos){
        if(modulos.length <= 0){
            save(modulo);
            return;
        }
    });
    console.log(modulo);
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000');
    db.run('PRAGMA journal_mode=WAL;');
    db.run("UPDATE Modulo SET descricao = $descricao, tensao_nominal = $tensao_nominal, capacidade_nominal = $capacidade_nominal, n_strings = $n_strings, n_baterias_por_strings = $n_baterias_por_strings "+
            ", contato = $contato, localizacao = $localizacao, fabricante = $fabricante, tipo = $tipo, data_instalacao = $data_instalacao, conf_alarme_id = $conf_alarme_id " +
                "WHERE id = $id", { $id: modulo.id,
                                    $descricao: modulo.descricao,
                                    $tensao_nominal: modulo.tensao_nominal,
                                    $capacidade_nominal: modulo.capacidade_nominal,
                                    $n_strings: modulo.n_strings,
                                    $n_baterias_por_strings: modulo.n_baterias_por_strings,
                                    $contato: modulo.contato,
                                    $localizacao: modulo.localizacao,
                                    $fabricante: modulo.fabricante,
                                    $tipo: modulo.tipo,
                                    $data_instalacao: modulo.data_instalacao,
                                    $conf_alarme_id: modulo.conf_alarme_id });
    db.close();
}
module.exports.save = save;
module.exports.createModulo = createModulo;
module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.update = update;