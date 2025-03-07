let express = require('express');
let db = require('../utils/db')
let router = express.Router();

router.get('/listar', function (req, res) { // mostrar as informações
    let cmd = 'SELECT IdAutor, NoAutor, NoNacionalidade';
    cmd += ' FROM TbAutor AS a INNER JOIN TbNacionalidade AS n';
    cmd += ' ON a.IdNacionalidade = n.IdNacionalidade ORDER BY NoAutor';
    
    db.query(cmd, [], function (erro, listagem) {
        if (erro) {
            res.send(erro);
        }
        res.render('autores-lista', { resultado: listagem });
    });
    
});


router.get('/listardd', function (req, res) {
    
    let cmd = 'SELECT * FROM TbAutor ';
    db.query(cmd, [], function (erro, listagem) {
        if (erro) {
            res.send(erro);
        }
        res.json({ resultado: listagem })
    });
});



router.get('/add', function (req, res) { //renderiza a página de cadastro
    res.render('autores-add', {resultado: {}})
});

router.post('/add', function (req, res) {
    
    let nome = req.body.nome;
    let nacionalidade = req.body.nacionalidade;

    let cmd = "INSERT INTO TbAutor (NoAutor, IdNacionalidade) VALUES (?, ?);";
    db.query(cmd, [nome, nacionalidade], function (erro) {
        if (erro) {
            res.send(erro);
        }
        res.redirect('/autores/listar');
    });
});




/* Rota para obter os dados atuais do autor*/
router.get('/edit/:id', function (req, res) {
    let id = req.params.id;
    let cmd = "SELECT * FROM TbAutor WHERE IdAutor = ?;";

    db.query(cmd, [id], function (erro, listagem) {
        if (erro) {
            res.send(erro);
        }
        res.render('autores-add', { resultado: listagem[0] });
    });
});


/* Rota para alterar dados de autor*/
router.put('/edit/:id', function (req, res) {
  let id = req.params.id;
  let nome = req.body.nome;
  let nacionalidade = req.body.nacionalidade;

  let cmd = "UPDATE TbAutor SET NoAutor = ?, IdNacionalidade = ? WHERE IdAutor = ?;";
  db.query(cmd, [nome, nacionalidade, id], function (erro, listagem) {
    if (erro) {
      res.send(erro);
    }
    //Code 303 permite o redirecionamento entre rotas com métodos diferentes:
    //PUT → GET
    res.redirect(303, '/autores/listar');
  });
});



/*Rota para excluir dados de autor*/
router.delete('/delete/:id', function (req, res) {
    let id = req.params.id;
    let cmd = "DELETE FROM TbAutor WHERE IdAutor = ?;";
    db.query(cmd, [id], function (erro) {
        if (erro) {
          // Verifica se o erro é de chave estrangeira
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



module.exports = router;