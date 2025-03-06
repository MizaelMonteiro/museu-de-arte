let express = require('express');
let db = require('../utils/db');
let router = express.Router();




router.get('/introducao', function (req, res) {
        res.render('introducao');

});

module.exports = router;