var express = require('express');
var router = express.Router();
var EmailServer = require('../models/EmailServer');
/* GET */
router.get('/', function (req, res, next) {
    EmailServer.getAll(function (err, emailServer) {
        console.log("getEmailServer");
        if (err) return next(err);
        console.log(emailServer);
        res.json(emailServer);
    });
});
/* GET /timeserver/id */
router.get('/:id', function (req, res, next) {
    EmailServer.getById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
module.exports = router;
/* POST */
router.post('/', function (req, res, next) {
    EmailServer.save(req.body, function (err) {
        if (err) {
            console.log('Erro ao salvar o emailServer: ' + err);
            throw err;
        }
        console.log('EmailServer salvo com sucesso');
    });
});
/* PUT /timeserver/:id */
router.put('/', function (req, res, next) {
    console.log(req.body);
    EmailServer.update(req.body);
    res.json(req.body);
});
/* DELETE /timeserver/:id */
router.delete('/:id', function (req, res, next) {

});

/* DELETE /timeserver/:id */
router.delete('/:id', function (req, res, next) {

});