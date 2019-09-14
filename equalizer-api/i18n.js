var i18n = require('i18n');
var Idioma = require('./models/Idioma')

i18n.configure({
  // setup some locales - other locales default to en silently
  locales:['pt-br','en'],

  // where to store json files - defaults to './locales' relative to modules directory
  directory: __dirname + '/locales',
  
  defaultLocale: 'en',
  
  // sets a custom cookie name to parse locale settings from  - defaults to NULL
  cookie: 'lang',
});

var gIdioma = null;

module.exports = function(req, res, next) {

  console.log("Definindo idioma");
  i18n.init(req, res);
  res.locals.__ = res.__;

  var _req = req;
  var i = Idioma.getLanguage(function (err, idioma) {
    if (err) {
        return next(err);
    }
    console.log("Do banco: " + idioma.idioma);
    gIdioma = idioma.idioma;
    
    var current_locale = i18n.getLocale();
    i18n.setLocale(_req, gIdioma);
  });

  console.log("Atualizando idioma para: " + gIdioma);
  i18n.setLocale(req, gIdioma);

  return next();
};