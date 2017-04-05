var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/Usuario');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            // check in mongo if a user with username exists or not
            User.getByEmail(username,
                function(err, user) {
                    console.log(err);
                    console.log(user);
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('Usuário ou senha inválidos.');
                        return done(null, false, req.flash('message', 'Usuário ou senha inválidos.'));
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)){
                        console.log('Usuário ou senha inválidos.');
                        return done(null, false, req.flash('message', 'Usuário ou senha inválidos.')); // redirect back to login page
                    }
                    if(user.acesso == ''){
                        console.log('Usuário aguardando liberação do Administrador.');
                        return done(null, false, req.flash('message', 'Usuário aguardando liberação do Administrador.')); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, user);
                }
            );

        })
    );


    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.senha);
    }
    
}