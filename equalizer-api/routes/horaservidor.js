var express = require('express');
var dateFormat = require('dateformat');
var router = express.Router();

router.get('/', function(req, res, next) {
    var day=dateFormat(new Date(), "dd/mm/yyyy HH:MM:ss Z");
    res.json(day);
});

module.exports = router;