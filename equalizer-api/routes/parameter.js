var express = require('express');
var router = express.Router();
var Parameter = require('../models/Parameters');
var bCrypt = require('bcrypt-nodejs');
/* GET */
router.get('/', function (req, res, next) {
    console.log("enter get parameter");
    Parameter.getLast(function (err, parameter) {
        if (err) {
            console.log(parameter);
            return next(err);
        }
        console.log(parameter);
        res.json(parameter);
    });
});
router.get('/:id', function (req, res, next) {
    
});
/* POST */
router.post('/', function (req, res, next) {
    var parameterPost = req.body;
    Parameter.get(function (err, parameter) {
        if (err) return next(err);
        if (parameter != null) {
            var newParameter = new Parameter.createParameters(parameterPost.duty_min, parameterPost.duty_max, parameterPost.delay, parameterPost.num_cycles_var_read, parameterPost.save_log_time);
            Parameter.update(newParameter);
        } else {
            var newParameter = new Parameter.createParameters(parameterPost.duty_min, parameterPost.duty_max, parameterPost.delay, parameterPost.num_cycles_var_read, parameterPost.save_log_time);
            Parameter.save(newParameter, function (err) {
                if (err)
                    console.log(err);
                else
                    console.log("Parameter saved");
            });
        }
    });
});
router.put('/', function (req, res, next) {
    console.log("put parameter");
    console.log(req.body);
    Parameter.update(req.body);
});
router.delete('/:id', function (req, res, next) {
    
});
module.exports = router;