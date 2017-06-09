var express = require('express');
var router = express.Router();
var EmailServer = require('../models/EmailServer');
/* GET */
router.get('/', function (req, res, next) {
    res.json("{}");
});
/* GET /timeserver/id */
router.get('/:id', function (req, res, next) {

});
module.exports = router;
/* POST */
router.post('/', function (req, res, next) {
    console.log(req.body);
    EmailServer.testeEmail(req.body, function (err) {
        console.log("Envio email...");
        if (err) {
            res.json("{emailEnviado:false}");
        } else {
            res.json("{emailEnviado:true}");
        }
    });

});
/* PUT /timeserver/:id */
router.put('/', function (req, res, next) {
    res.json(req.body);
});
/* DELETE /timeserver/:id */
router.delete('/:id', function (req, res, next) {

});

/* DELETE /timeserver/:id */
router.delete('/:id', function (req, res, next) {

});