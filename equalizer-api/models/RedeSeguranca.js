var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');

var createRedeSeguranca = function (id, mac, velocidadePlacaRede, localAddress, gateway, mascara, servidorDNS, nomeDoSistema, localDoSistema, contatoDoSistema, httpPort, 
                                    useHttps, httpsPort, httpTempoDeAtualizacao, paginaPadraoHttp) {
    return {
        id: id,
        mac : mac, 
        velocidadePlacaRede: velocidadePlacaRede, 
        localAddress: localAddress, 
        gateway: gateway, 
        mascara: mascara, 
        servidorDNS: servidorDNS, 
        nomeDoSistema:nomeDoSistema, 
        localDoSistema: localDoSistema, 
        contatoDoSistema: contatoDoSistema, 
        httpPort: httpPort,
        useHttps: useHttps == true ? 1 : useHttps,
        httpsPort: httpsPort,
        httpTempoDeAtualizacao: httpTempoDeAtualizacao,
        paginaPadraoHttp: paginaPadraoHttp
    }
}
var save = function (redeSeguranca, err) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000');
    db.run('PRAGMA journal_mode=WAL;');
    var stmt = db.prepare("INSERT INTO RedeSeguranca(mac, velocidadePlacaRede, localAddress, gateway, mascara, servidorDNS, nomeDoSistema, localDoSistema, contatoDoSistema, httpPort, "+
                                    "useHttps, httpsPort, httpTempoDeAtualizacao, paginaPadraoHttp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    stmt.run(redeSeguranca.mac, redeSeguranca.velocidadePlacaRede, redeSeguranca.localAddress, redeSeguranca.gateway, redeSeguranca.mascara, redeSeguranca.servidorDNS, 
                redeSeguranca.nomeDoSistema, redeSeguranca.localDoSistema, redeSeguranca.contatoDoSistema, redeSeguranca.httpPort, redeSeguranca.useHttps, redeSeguranca.httpsPort, 
                redeSeguranca.httpTempoDeAtualizacao, redeSeguranca.paginaPadraoHttp, function (error) {
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
    db.run('PRAGMA busy_timeout = 10000');
    db.run('PRAGMA journal_mode=WAL;');
    db.all("SELECT id, mac, velocidadePlacaRede, localAddress, gateway, mascara, servidorDNS, nomeDoSistema, localDoSistema, contatoDoSistema, httpPort, " +
                                    "useHttps, httpsPort, httpTempoDeAtualizacao, paginaPadraoHttp " +
            "FROM RedeSeguranca", function (err, rows) {
        var redeSeguranca = [];
        rows.forEach(function row(row) {
            redeSeguranca.push(new createRedeSeguranca(row.id, row.mac, row.velocidadePlacaRede, row.localAddress, row.gateway, row.mascara, row.servidorDNS, row.nomeDoSistema, 
                                        row.localDoSistema, row.contatoDoSistema, row.httpPort, row.useHttps == 1 ? true : false, row.httpsPort, row.httpTempoDeAtualizacao, row.paginaPadraoHttp));
        });
        data(err, redeSeguranca);
    });
    db.close();
}
var update = function (redeSeguranca) {
    console.log("update");
    console.log(redeSeguranca);
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 10000');
    db.run('PRAGMA journal_mode=WAL;');
    db.run("UPDATE RedeSeguranca set mac = $mac, velocidadePlacaRede = $velocidadePlacaRede, localAddress = $localAddress, gateway = $gateway, mascara = $mascara" +
                                ", servidorDNS = $servidorDNS, nomeDoSistema = $nomeDoSistema, localDoSistema = $localDoSistema, contatoDoSistema = $contatoDoSistema" +
                                ", httpPort = $httpPort, useHttps = $useHttps, httpsPort = $httpsPort, httpTempoDeAtualizacao = $httpTempoDeAtualizacao, paginaPadraoHttp = $paginaPadraoHttp " +
                "WHERE id = $id", { $id: redeSeguranca.id,
                                    $mac : redeSeguranca.mac, 
                                    $velocidadePlacaRede: redeSeguranca.velocidadePlacaRede, 
                                    $localAddress: redeSeguranca.localAddress, 
                                    $gateway: redeSeguranca.gateway, 
                                    $mascara: redeSeguranca.mascara, 
                                    $servidorDNS: redeSeguranca.servidorDNS, 
                                    $nomeDoSistema: redeSeguranca.nomeDoSistema, 
                                    $localDoSistema: redeSeguranca.localDoSistema, 
                                    $contatoDoSistema: redeSeguranca.contatoDoSistema, 
                                    $httpPort: redeSeguranca.httpPort,
                                    $useHttps: redeSeguranca.useHttps,
                                    $httpsPort: redeSeguranca.httpsPort,
                                    $httpTempoDeAtualizacao: redeSeguranca.httpTempoDeAtualizacao,
                                    $paginaPadraoHttp: redeSeguranca.paginaPadraoHttp });
    db.close();
}
module.exports.save = save;
module.exports.getAll = getAll;
module.exports.update = update;