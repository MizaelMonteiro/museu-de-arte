let express = require('express');
let db = require('../utils/db');
let router = express.Router();

router.get('/listar', function (req, res) {
    let cmd = 'SELECT a.IdObra, a.TituloObra, n.NoAutor, a.AnoObra, a.TecnicaObra, s.NoSessao';
    cmd += ' FROM TbObra AS a';
    cmd += ' INNER JOIN TbAutor AS n ON a.IdAutor = n.IdAutor';
    cmd += ' INNER JOIN TbSessao AS s ON a.IdSessao = s.IdSessao';
    cmd += ' ORDER BY a.TituloObra;';
    db.query(cmd, [], function (erro, listagem) {
        if (erro) {
            return res.send(erro);
        }
        res.render('obras-lista', { resultado: listagem });
    });
});

router.get('/add', function (req, res) {
    res.render('obras-add', { resultado: {} });
});

router.post('/add', function (req, res) {
    let titulo = req.body.Titulo;
    let tecnica = req.body.Tecnica;
    let ano = req.body.Ano;
    let autor = req.body.autor;
    let sessao = req.body.sessao;
    
    let cmd = "INSERT INTO TbObra (TituloObra, TecnicaObra, AnoObra, IdSessao, IdAutor) VALUES (?, ?, ?, ?, ?);";
    db.query(cmd, [titulo, tecnica, ano, sessao, autor], function (erro, result) {
        if (erro) {
            return res.send(erro);
        }
        let idObra = result.insertId;
        // Insere em obrasessao com DataAdicao definida como a data atual (NOW())
        let cmd2 = "INSERT INTO tbobrasessao (IdObra, IdSessao, DataAdicao) VALUES (?, ?, NOW());";
        db.query(cmd2, [idObra, sessao], function (erro2) {
            if (erro2) {
                return res.send(erro2);
            }
            res.redirect('/obras/listar');
        });
    });
});


/* Rota para obter os dados atuais da obra para edição */
router.get('/edit/:id', function (req, res) {
    let id = req.params.id;
    let cmd = "SELECT * FROM TbObra WHERE IdObra = ?;";
    db.query(cmd, [id], function (erro, listagem) {
        if (erro) {
            return res.send(erro);
        }
        res.render('obras-add', { resultado: listagem[0] });
    });
});

/* Rota para alterar dados da obra */
router.put('/edit/:id', function (req, res) {
    let id = req.params.id;
    let titulo = req.body.Titulo;
    let tecnica = req.body.Tecnica;
    let ano = req.body.Ano;
    let autor = req.body.autor;
    let sessao = req.body.sessao;
    
    let cmd = "UPDATE TbObra SET TituloObra = ? , TecnicaObra = ? , AnoObra = ? , IdSessao = ? , IdAutor = ? WHERE IdObra = ?;";
    db.query(cmd, [titulo, tecnica, ano, sessao, autor, id], function (erro) {
        if (erro) {
            return res.send(erro);
        }
        res.redirect(303, '/obras/listar');
    });
});

/* Rota para excluir dados da obra */
router.delete('/delete/:id', function (req, res) {
    let id = req.params.id;



    let cmd2 = "DELETE FROM TbObrasessao WHERE IdObra = ?;";
    db.query(cmd2, [id], function (erro) {
        if (erro) {
            return res.status(500).json({ message: 'Erro ao excluir informação da tabela tbobrasessao' });
        }


        let cmd = "DELETE FROM TbObra WHERE IdObra = ?;";
        db.query(cmd, [id], function (erro) {
            if (erro) {
              if (erro.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(400).json({ 
                  message: 'Não é possível excluir esta informação, pois ela é necessária em outra tabela.' 
                });
              }
              return res.status(500).json({ message: 'Erro ao excluir informação.' });
            }
            res.json({ message: 'Informação excluída com sucesso' });
          });

    });










   
});

module.exports = router;
