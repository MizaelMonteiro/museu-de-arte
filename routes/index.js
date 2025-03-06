let express = require('express');
let router = express.Router();

/* Rota principal usando a view index.ejs. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Rota “sobre” sem usar uma view. */
router.get('/sobre', function (req, res) {
  let msg = '<h2>Sobre Rotas...</h2>';
  res.send(msg);
});

module.exports = router;