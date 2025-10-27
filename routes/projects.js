var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('projects', { title: 'Projetos - Jean Correia' });
});

module.exports = router;