var express = require('express');
let db = require('../utils/db');
var router = express.Router();

router.get('/listar', function (req, res) {
    let cmd = 'SELECT * FROM TbNacionalidade ';
    db.query(cmd, [], function (erro, listagem) {
        if (erro) {
            res.send(erro);
        }
        res.json({ resultado: listagem })
    });
});

router.get('/add', function (req, res) {
    res.render("nacionalidades-add")
})

router.post('/add', function (req, res) {
    let nacionalidades = req.body.nacionalidades;
    let idnacionalidades = req.body.Idnacionalidade;

    let cmd = "INSERT INTO TbNacionalidade(NoNacionalidade, IdNacionalidade) VALUES (?, ?);";
    db.query(cmd, [nacionalidades, idnacionalidades], function (erro) {
        if (erro) {
            res.send(erro);
        }
        res.redirect('/nacionalidades/listar');
    })
}
)



module.exports = router;