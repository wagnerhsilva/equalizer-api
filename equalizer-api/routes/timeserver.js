var express = require('express');
var router = express.Router();
var TimeServer = require('../models/TimeServer');
/* GET */
router.get('/', function (req, res, next) {
    TimeServer.getAll(function (err, timeServer) {
        console.log("getTimeServer");
        if (err) return next(err);
        console.log(timeServer);
        res.json(timeServer);
    });
});
/* GET /timeserver/id */
router.get('/:id', function (req, res, next) {
    TimeServer.getById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
module.exports = router;
/* POST */
router.post('/', function (req, res, next) {
    TimeServer.save(req.body, function (err) {
        if (err) {
            console.log('Erro ao salvar o timeServer: ' + err);
            throw err;
        }
        console.log('TimeServer salvo com sucesso');
    });
});
/* PUT /timeserver/:id */
router.put('/', function (req, res, next) {
    console.log(req.body);
    TimeServer.update(req.body);
    res.json(req.body);
});
/* DELETE /timeserver/:id */
router.delete('/:id', function (req, res, next) {
    
});