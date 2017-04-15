var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/Usuario');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.getByEmail(username, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Erro ao registrar: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: '+username);
                        return done(null, false, req.flash('message','Usuário já existe.'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User.createUser('',  req.param('nomeUsuario'), req.param('sobrenomeUsuario'), req.param('telefoneUsuario'), username, password, "");
                        // save the user
                        User.save(newUser, function(err) {
                            if (err){
                                console.log('Erro ao salvar o usuário: '+err);
                                throw err;  
                            }
                            console.log('User Registration succesful');    
                            return done(null, newUser);
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}