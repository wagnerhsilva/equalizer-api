var sqlite3 = require('sqlite3').verbose();
var bCrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var RedeSeguranca = require('./RedeSeguranca');
var AlarmLog = require('./AlarmLog');

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
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
    var stmt = db.prepare("INSERT INTO EmailServer(server, portaSMTP, usarCriptografiaTLS, email, assunto, usarAutenticacao, login, senha) VALUES (?,?,?,?,?,?,?,?)");
    stmt.run(emailServer.server, emailServer.portaSMTP, emailServer.usarCriptografiaTLS, emailServer.email, emailServer.assunto, emailServer.usarAutenticacao, emailServer.login, emailServer.senha);
    stmt.finalize();
    db.close();
}
var getAll = function (data) {
    var db = new sqlite3.Database('equalizerdb');
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
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
    db.run('PRAGMA busy_timeout = 60000;');
    db.run('PRAGMA journal_mode=WAL;');
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
var sendEmail = function (data) {
    getAll(function (err, emailServer) {
        RedeSeguranca.getAll(function (err2, redeSeguranca) {
            AlarmLog.getAll(function (err3, alarmLogs) {
                AlarmLog.getEnviaEmail(function (err4, conta) {
                    if (err) return next(err);
                    if (err2) return next(err2);
                    if (err3) return next(err3);
                    if (err4) return next(err4);
                    console.log("contaEnviaEmail: " + conta);
                    if (conta > 0) {
                        var logToText = "dataHora;descricao;\n";
                        alarmLogs.forEach(function (alarm) {
                            logToText += alarm.dataHora.toLocaleString() + ";" + alarm.descricao + ";\n"
                        }, this);
                        var attachment = [
                            {   // define custom content type for the attachment
                                filename: 'log.csv',
                                content: logToText,
                                contentType: 'text/plain',
                                encoding: 'UTF-8'
                            }
                        ];
                        var smtpConfig = {
                            host: emailServer[0].server,
                            port: emailServer[0].portaSMTP,
                            secureConnection: emailServer[0].usarCriptografiaTLS == 1 ? false : true,
                            auth: {
                                user: emailServer[0].login,
                                pass: emailServer[0].senha
                            }
                        };
                        var transporter = nodemailer.createTransport(smtpConfig);
                        var mailOptions = {
                            from: emailServer[0].email,
                            to: redeSeguranca[0].contatoDoSistema,
                            subject: emailServer[0].assunto,
                            text: 'Alarme de sistema disparado',
                            html: '<b>Alarme de sistema disparado</b>',
                            attachments: attachment
                        };
                        transporter.verify(function (error, success) {
                            if (error) {
                                console.log(error);

                            } else {
                                console.log('Server is ready to take our messages');
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        return console.log(error);
                                    }
                                    console.log('Message %s sent: %s', info.messageId, info.response);
                                });
                            }
                            // Flavio Alves: o email, mesmo quando não e enviado com sucesso,
                            // nao deve ser armazenado para envio posterior
                            AlarmLog.updateEnviaEmail();
                        });
                    }
                });
            });
        });
    });
}
var testeEmail = function (data) {
    getAll(function (err, emailServer) {
        AlarmLog.getAll(function (err2, alarmLogs) {
            if (err) return next(err);
            if (err2) return next(err2);
            var logToText = "dataHora;descricao;\n";
            alarmLogs.forEach(function (alarm) {
                logToText += alarm.dataHora.toISOString() + ";" + alarm.descricao + ";\n"
            }, this);
            var attachment = [
                {   // define custom content type for the attachment
                    filename: 'log.csv',
                    content: logToText,
                    contentType: 'text/plain',
                    encoding: 'UTF-8'
                }
            ];
            var smtpConfig = {
                host: emailServer[0].server,
                port: emailServer[0].portaSMTP,
                secureConnection: emailServer[0].usarCriptografiaTLS == 1 ? false : true,
                auth: {
                    user: emailServer[0].login,
                    pass: emailServer[0].senha
                }
            };
            var transporter = nodemailer.createTransport(smtpConfig);
            var mailOptions = {
                from: emailServer[0].email,
                to: data.emailsDestino,
                subject: data.assunto,
                text: data.mensagem,
                html: data.mensagem,
                attachments: attachment
            };
            transporter.verify(function (error, success) {
                if (error) {
                    var db = new sqlite3.Database('equalizerdb');
                    db.run('PRAGMA busy_timeout = 60000;');
                    db.run('PRAGMA journal_mode=WAL;');
                    db.run("INSERT INTO AlarmLog(dataHora, descricao, emailEnviado, n_ocorrencias) VALUES (datetime('now','localtime'), 'Erro ao enviar email de teste.', 0, 1)");
                    console.log(error);
                } else {
                    console.log('Server is ready to take our messages');
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            var db = new sqlite3.Database('equalizerdb');
                            db.run('PRAGMA busy_timeout = 60000;');
                            db.run('PRAGMA journal_mode=WAL;');
                            db.run("INSERT INTO AlarmLog(dataHora, descricao, emailEnviado, n_ocorrencias) VALUES (datetime('now','localtime'), 'Erro ao enviar email de teste.', 0, 1)");
                            return console.log(error);
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);
                    });
                }
                // Flavio Alves: o email, mesmo quando não e enviado com sucesso,
                // nao deve ser armazenado para envio posterior
                AlarmLog.updateEnviaEmail();
            });
        });
    });
}
module.exports.save = save;
module.exports.createEmailServer = createEmailServer;
module.exports.getAll = getAll;
module.exports.update = update;
module.exports.sendEmail = sendEmail;
module.exports.testeEmail = testeEmail;
