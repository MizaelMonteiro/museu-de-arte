let express = require('express');
let db = require('../utils/db');
let router = express.Router();
const moment = require('moment');

// Listagem de Funcionários com junção para exibir o nome da sessão
router.get('/listar', function (req, res) {
    let cmd = 'SELECT f.IdFuncionario, f.NoFuncionario, f.Funcao, f.DataContratacao, f.DataDemissao, s.NoSessao ';
    cmd += 'FROM TbFuncionario AS f INNER JOIN TbSessao AS s ';
    cmd += 'ON f.IdSessao = s.IdSessao ORDER BY f.NoFuncionario';

    db.query(cmd, [], function (erro, listagem) {
        if (erro) {
            res.send(erro);
        }
        // Formata as datas para exibição na lista
        listagem.forEach(item => {
            item.DataContratacao = moment(item.DataContratacao).format('DD/MM/YYYY');
            item.DataDemissao = moment(item.DataDemissao).format('DD/MM/YYYY');
        });
        res.render('funcionarios-lista', { resultado: listagem, moment: moment });
    });
});

// Rota para retornar dados para dropdown (dados de Sessão)
router.get('/listardd', function (req, res) {
    let cmd = 'SELECT * FROM TbSessao';
    db.query(cmd, [], function (erro, listagem) {
        if (erro) {
            res.send(erro);
        }
        res.json({ resultado: listagem });
    });
});

// Página para cadastro (formulário vazio)
router.get('/add', function (req, res) {
    res.render('funcionarios-add', { resultado: {} });
});

// Inclusão de novo funcionário via POST
router.post('/add', function (req, res) {
    let nome = req.body.nome;
    let funcao = req.body.funcao;
    let dtcontrato = req.body.dtcontrato;
    let dtdemissao = req.body.dtdemissao;
    let sessao = req.body.sessao;

    let cmd = "INSERT INTO TbFuncionario (NoFuncionario, Funcao, DataContratacao, DataDemissao, IdSessao) VALUES (?, ?, ?, ?, ?);";
    db.query(cmd, [nome, funcao, dtcontrato, dtdemissao, sessao], function (erro) {
        if (erro) {
            res.send(erro);
        }
        res.redirect('/funcionarios/listar');
    });
});

// Página para edição: carrega os dados atuais do funcionário
router.get('/edit/:id', function (req, res) {
    let id = req.params.id;
    let cmd = "SELECT * FROM TbFuncionario WHERE IdFuncionario = ?;";
    db.query(cmd, [id], function (erro, listagem) {
        if (erro) {
            res.send(erro);
        }
        res.render('funcionarios-add', { resultado: listagem[0] });
    });
});

// Atualização dos dados do funcionário via PUT (chamada AJAX)
router.put('/edit/:id', function (req, res) {
    let id = req.params.id;
    let nome = req.body.nome;
    let funcao = req.body.funcao;
    let dtcontrato = req.body.dtcontrato;
    let dtdemissao = req.body.dtdemissao;
    let sessao = req.body.sessao;
    

    let cmd = "UPDATE TbFuncionario SET NoFuncionario = ?, Funcao = ?, DataContratacao = ?, DataDemissao = ?, IdSessao = ? WHERE IdFuncionario = ?;";
    db.query(cmd, [nome, funcao, dtcontrato, dtdemissao, sessao, id], function (erro) {
        if (erro) {
            res.send(erro);
        }
        res.redirect(303, '/funcionarios/listar');
    });
});

// Exclusão do funcionário
router.delete('/delete/:id', function (req, res) {
    let id = req.params.id;
    let cmd = "DELETE FROM TbFuncionario WHERE IdFuncionario = ?;";
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
