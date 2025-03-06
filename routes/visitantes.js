var express = require('express');
let db = require('../utils/db');
var router = express.Router();
const moment = require('moment');

// Listagem de visitantes com junção para exibir o nome da nacionalidade
router.get('/listar', function (req, res) {
  let cmd = 'SELECT v.IdVisitante, v.NoVisitante, v.IdadeVisitante, v.SexoVisitante, n.NoNacionalidade';
  cmd += ' FROM TbVisitante AS v INNER JOIN TbNacionalidade AS n';
  cmd += ' ON v.IdNacionalidade = n.IdNacionalidade';
  cmd += ' ORDER BY v.NoVisitante';

  db.query(cmd, [], function (erro, listagem) {
    if (erro) {
      return res.send(erro);
    }
    res.render('visitantes-lista', { resultado: listagem });
  });
});

// Rota para retornar as exposições (para preencher o <select> do formulário de visitantes)
router.get('/listexposicoes', function (req, res) {
  let cmd = 'SELECT * FROM TbExposicao ORDER BY TituloExposicao';
  db.query(cmd, [], function (erro, listagem) {
    if (erro) {
      return res.status(500).json({ message: 'Erro ao buscar exposições', error: erro });
    }
    res.json({ resultado: listagem });
  });
});

// Exibe o formulário para cadastro (inclusão)
router.get('/add', function (req, res) {
  res.render("visitantes-add", { resultado: {} });
});

// Insere um novo visitante e, automaticamente, registra em TbVisitanteExposicao
router.post('/add', function (req, res) {
  // Dados do visitante e informações da visita
  let { nome, idade, sexo, nacionalidade, exposicao, datavisita } = req.body;

  // 1) Inserir visitante em TbVisitante
  let cmd = "INSERT INTO TbVisitante(NoVisitante, IdadeVisitante, SexoVisitante, IdNacionalidade) VALUES (?, ?, ?, ?);";
  db.query(cmd, [nome, idade, sexo, nacionalidade], function (erro, result) {
    if (erro) {
      return res.status(500).json({ message: 'Erro ao inserir visitante', error: erro });
    }
    let newVisitorId = result.insertId;

    // 2) Buscar os dados da exposição para validar a data de visita
    let cmd2 = "SELECT DtInicioExposicao, DtFimExposicao FROM TbExposicao WHERE IdExposicao = ?;";
    db.query(cmd2, [exposicao], function (erro2, rowsExpo) {
      if (erro2) {
        return res.status(500).json({ message: 'Erro ao buscar exposição', error: erro2 });
      }
      if (rowsExpo.length === 0) {
        return res.status(400).json({ message: 'Exposição não encontrada' });
      }
      let dtInicio = new Date(rowsExpo[0].DtInicioExposicao);
      let dtFim = new Date(rowsExpo[0].DtFimExposicao);
      let dtVisita = new Date(datavisita);

      // 3) Verificar se a data da visita está entre a data de início e fim da exposição
      if (dtVisita < dtInicio || dtVisita > dtFim) {
        return res.status(400).json({
          message: `A data de visita (${datavisita}) está fora do período da exposição (${moment(dtInicio).format('DD/MM/YYYY')} a ${moment(dtFim).format('DD/MM/YYYY')}).`
        });
      }

      // 4) Inserir os dados em TbVisitanteExposicao
      let cmd3 = "INSERT INTO TbVisitanteExposicao(IdExposicao, IdVisitante, DataVisita) VALUES (?, ?, ?);";
      db.query(cmd3, [exposicao, newVisitorId, datavisita], function (erro3) {
        if (erro3) {
          return res.status(500).json({ message: 'Erro ao registrar visita', error: erro3 });
        }
        res.json({ message: 'Visitante cadastrado com sucesso!' });
      });
    });
  });
});

// Carrega os dados atuais do visitante para edição
router.get('/edit/:id', function (req, res) {
  let id = req.params.id;
  let cmd = "SELECT * FROM TbVisitante WHERE IdVisitante = ?;";
  db.query(cmd, [id], function (erro, listagem) {
    if (erro) {
      return res.send(erro);
    }
    res.render('visitantes-add', { resultado: listagem[0] });
  });
});

// Atualiza os dados do visitante via PUT (chamada AJAX)
router.put('/edit/:id', function (req, res) {
  let id = req.params.id;
  let { nome, idade, sexo, nacionalidade } = req.body;
  let cmd = "UPDATE TbVisitante SET NoVisitante = ?, IdadeVisitante = ?, SexoVisitante = ?, IdNacionalidade = ? WHERE IdVisitante = ?;";
  db.query(cmd, [nome, idade, sexo, nacionalidade, id], function (erro) {
    if (erro) {
      return res.send(erro);
    }
    res.redirect(303, '/visitantes/listar');
  });
});

// Exclui um visitante
router.delete('/delete/:id', function (req, res) {
  let id = req.params.id;

  let cmd2 = "DELETE FROM TbVisitanteexposicao WHERE IdVisitante = ?;";
  db.query(cmd2, [id], function (erro) {
    if (erro) {
      return res.status(500).json({ message: 'Erro ao excluir informação da tabela tbvisitanteexposicao' });
    }


    let cmd = "DELETE FROM TbVisitante WHERE IdVisitante = ?;";
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










});

module.exports = router;
