var i18n = require('i18n');

i18n.configure({
  // setup some locales - other locales default to en silently
  locales:['pt-br','en'],

  // where to store json files - defaults to './locales' relative to modules directory
  directory: __dirname + '/locales',
  
  defaultLocale: 'en',
  
  // sets a custom cookie name to parse locale settings from  - defaults to NULL
  cookie: 'lang',
});

module.exports = function(req, res, next) {

  console.log("Definindo idioma");
  i18n.init(req, res);
  res.locals.__ = res.__;

  var current_locale = i18n.getLocale();
  console.log(current_locale);
  i18n.setLocale(req, current_locale);

  return next();
};