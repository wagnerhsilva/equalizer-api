var express = require('express');
var router = express.Router();
var Idioma = require('../models/Idioma');
var i18n = require('../i18n');

/* GET */
router.get('/', function (req, res, next) {
    console.log("Lendo o idioma");
    Idioma.getLast(function (err, idioma) {
        if (err) {
            console.log(idioma);
            return next(err);
        }
        console.log(idioma);
        res.json(idioma);
    });
});
router.get('/:id', function (req, res, next) {
    
});

/* POST */
router.post('/', function (req, res, next) {
    var idiomaPost = req.body;
    Idioma.get(function (err, idioma) {
        if (err) 
            return next(err);
        if (idioma != null) {
            var newIdioma = new Idioma.createIdioma(idiomaPost.idioma);
            Idioma.update(newIdioma);
            console.log("Atualizando o suporte ao idioma para o " + newIdioma.idioma);
            i18n.setLocale(newIdioma.idioma);
        }
    });
});

router.put('/', function (req, res, next) {
    console.log("put idiom");
    console.log(req.body);
    Idioma.update(req.body);
});
router.delete('/:id', function (req, res, next) {
    
});
module.exports = router;