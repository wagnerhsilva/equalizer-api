var express = require('express');
var router = express.Router();
var SnmpConfig = require('../models/SnmpConfig');
var bCrypt = require('bcrypt-nodejs');
/* GET */
router.get('/', function (req, res, next) {
    SnmpConfig.getAll(function (err, modulos) {
        if (err) return next(err);
        res.json(modulos);
    });
});
/* GET /snmpconfig/id */
router.get('/:id', function (req, res, next) {
    
    
});
module.exports = router;
/* POST */
router.post('/', function (req, res, next) {
    
});
/* PUT /snmpconfig/:id */
router.put('/', function (req, res, next) {
    var newConfig = req.body[0];
    var oldConfig = req.body[1];

    oldConfig.version = newConfig.version;
    oldConfig.is_on = newConfig.is_on;
    if(newConfig.version == 1){ //going to snmp v3
        oldConfig.auth = newConfig.auth;
        oldConfig.user = newConfig.user;
        oldConfig.pass = newConfig.pass;
    }else{ //snmp v1/v2
        oldConfig.traps = newConfig.traps;
        oldConfig.comm = newConfig.comm;
    }

    SnmpConfig.update(oldConfig);
});