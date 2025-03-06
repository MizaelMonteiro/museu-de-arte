let express = require('express');
let db = require('../utils/db');
let router = express.Router();

// Listar sessões com contagem de obras a partir de obrasessao
router.get('/listar', function (req, res) {
  let cmd = `
    SELECT s.IdSessao, s.NoSessao, s.LocalSessao, e.TituloExposicao,
           COUNT(os.IdObra) AS QtdObras
    FROM TbSessao s
    INNER JOIN TbExposicao e ON s.IdExposicao = e.IdExposicao
    LEFT JOIN tbobrasessao os ON s.IdSessao = os.IdSessao
    GROUP BY s.IdSessao, s.NoSessao, s.LocalSessao, e.TituloExposicao
    ORDER BY s.NoSessao;
  `;

  db.query(cmd, [], function (erro, listagem) {
    if (erro) {
      return res.send(erro);
    }
    res.render('sessoes-lista', { resultado: listagem });
  });
});

// Retornar sessões para dropdown (se necessário)
router.get('/listardd', function (req, res) {
  let cmd = 'SELECT * FROM TbSessao';
  db.query(cmd, [], function (erro, listagem) {
    if (erro) {
      return res.send(erro);
    }
    res.json({ resultado: listagem });
  });
});



// Página para inclusão (formulário vazio)
router.get('/add', function (req, res) {
  res.render('sessoes-add', { resultado: {} });
});

// Inclusão de nova sessão via POST – "QtdObrasSessao" é definido automaticamente como 0
router.post('/add', function (req, res) {
  let nome = req.body.nome;
  let local = req.body.local;
  let exposicao = req.body.exposicao;

  let cmd = "INSERT INTO TbSessao (NoSessao, LocalSessao, QtdObrasSessao, IdExposicao) VALUES (?, ?, ?, ?);";
  db.query(cmd, [nome, local, 0, exposicao], function (erro) {
    if (erro) {
      return res.send(erro);
    }
    res.redirect('/sessoes/listar');
  });
});

// Página para edição: carrega os dados atuais da sessão
router.get('/edit/:id', function (req, res) {
  let id = req.params.id;
  let cmd = "SELECT * FROM TbSessao WHERE IdSessao = ?;";
  db.query(cmd, [id], function (erro, listagem) {
    if (erro) {
      return res.send(erro);
    }
    res.render('sessoes-add', { resultado: listagem[0] });
  });
});

// Alteração dos dados da sessão via PUT (usado no AJAX)
router.put('/edit/:id', function (req, res) {
  let id = req.params.id;
  let nome = req.body.nome;
  let local = req.body.local;
  let exposicao = req.body.exposicao;

  let cmd = "UPDATE TbSessao SET NoSessao = ?, LocalSessao = ?, IdExposicao = ? WHERE IdSessao = ?;";
  db.query(cmd, [nome, local, exposicao, id], function (erro) {
    if (erro) {
      return res.send(erro);
    }
    res.redirect(303, '/sessoes/listar');
  });
});

// Exclusão de sessão
router.delete('/delete/:id', function (req, res) {
  let id = req.params.id;
  let cmd = "DELETE FROM TbSessao WHERE IdSessao = ?;";
  db.query(cmd, [id], function (erro) {
    if (erro) {
      return res.send(erro);
    }
    res.redirect(303, '/sessoes/listar');
  });
});

module.exports = router;
