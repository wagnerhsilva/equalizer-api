var express = require('express');
var router = express.Router();
var Usuario = require('../models/Usuario');
var bCrypt = require('bcrypt-nodejs');
/* GET */
router.get('/', function (req, res, next) {
    Usuario.getAll(function (err, usuarios) {
        if (err) return next(err);
        res.json(usuarios);
    });
});
/* GET /usuarios/id */
router.get('/:id', function (req, res, next) {
    Usuario.getById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
module.exports = router;
/* POST */
router.post('/', function (req, res, next) {
    var usuarioPost = req.body;
    findOrCreateUser = function(){
                // find a user in Mongo with provided username
                Usuario.getByEmail(usuarioPost.email, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Erro ao registrar: '+err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: '+usuarioPost.email);
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new Usuario.createUser('',  usuarioPost.nome, usuarioPost.sobreNome, usuarioPost.telefone, usuarioPost.email, usuarioPost.senha, "usuario");
                        // save the user
                        Usuario.save(newUser, function(err) {
                            if (err){
                                console.log('Erro ao salvar o usuário: '+err);
                                throw err;  
                            }
                            console.log('User Registration succesful');    
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);

});
/* PUT /usuarios/:id */
router.put('/:id', function (req, res, next) {
    console.log(req.body);
    Usuario.updateAcesso(req.body);
    res.json(req.body);
});
/* PUT /usuarios/:id */
router.put('/', function (req, res, next) {
    console.log(req.body);
    Usuario.update(req.body);
    res.json(req.body);
});
/* DELETE /usuarios/:id */
router.delete('/:id', function (req, res, next) {
    console.log(req.params.id);
    Usuario.delete(req.params.id);
    res.json(req.body);
});
var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }