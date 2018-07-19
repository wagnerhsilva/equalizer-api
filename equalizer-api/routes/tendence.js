var express = require('express');
var router = express.Router();
var Tendence = require('../models/Tendence');
var bCrypt = require('bcrypt-nodejs');
/* GET */
router.get('/', function (req, res, next) {
    var parameters = function(args){
        console.log(args);
        res.json(args);
    };

    var error = function(err){
        console.log("Error on getting Tendence configuration")
        console.log(err);
        return next(err);
    };

    Tendence.get(parameters, error);
});
/* GET /tendence/status */
router.get('/status', function (req, res, next) {
    var data_callback = function(data){
        console.log(data);
        res.json(data);
    };

    var err_callback = function(err){
        console.log(err);
        return next(err);
    };

    Tendence.get_data(data_callback, err_callback);

});
module.exports = router;
/* POST */
router.post('/', function (req, res, next) {
    console.log("POST");
});
/* PUT /modulo/:id */
router.put('/', function (req, res, next) {
   var tendenceObj = Tendence.createTendence(
       req.body.is_on ? 1 : 0,
       req.body.install_date,
       req.body.zero_date_months,
       req.body.period_date_months,
       parseFloat(req.body.impe_min),
       parseFloat(req.body.impe_max),
       parseFloat(req.body.temp_min),
       parseFloat(req.body.temp_max)
   );
   Tendence.persist(tendenceObj, function(err){
       console.log("Error trying to persist information");
       return next(err);
   });
});