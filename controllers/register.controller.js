var libs      =   process.cwd() + '/libs/';
var config    =   require(libs + 'config');
var log       =   require(libs + 'log')(module);
var express   =   require('express');
var router    =   express.Router();
var request   =   require('request');

router.get('/', function (req, res) {
  res.render('register');
});

router.post('/', function (req, res) {
  // register using api to maintain clean separation between layers
  request.post({
    url: config.get('apiUrl') + '/users/register',
    form: req.body,
    json: true
  }, function (error, response, body) {
    if (error) {
      log.error("Controller returns error: ", error);
      return res.render('register', {
        error: 'An error occurred'
      });
    }

    if (response.statusCode !== 200) {
      return res.render('register', {
        error: response.body,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.username
      });
    }

    // return to login page with success message
    req.session.success = 'Registration successful';
    return res.redirect('/login');
  });
});

module.exports = router;