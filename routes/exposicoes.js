var express = require('express');
let db = require('../utils/db');
var router = express.Router();
const moment = require('moment');

// Rota para listar exposições (para exibição na lista, formata as datas)
router.get('/listar', function (req, res) {
    let cmd = 'SELECT IdExposicao, TituloExposicao, DuracaoExposicao, DtInicioExposicao, DtFimExposicao ';
    cmd += 'FROM TbExposicao ';
    cmd += 'ORDER BY TituloExposicao';
    db.query(cmd, [], function (erro, listagem) {
        if (erro) {
            res.send(erro);
        }
        // Formata as datas para exibição na lista
        listagem.forEach(item => {
            item.DtInicioExposicao = moment(item.DtInicioExposicao).format('DD/MM/YYYY');
            item.DtFimExposicao = moment(item.DtFimExposicao).format('DD/MM/YYYY');
        });
        res.render('exposicoes-lista', { resultado: listagem, moment: moment });
    });
});

// Rota para retornar exposições (usada para dropdown, se necessário)
router.get('/listardd', function (req, res) {
    let cmd = 'SELECT * FROM TbExposicao';
    db.query(cmd, [], function (erro, listagem) {
        if (erro) {
            res.send(erro);
        }
        res.json({ resultado: listagem });
    });
});

// Rota para exibir a página de cadastro (formulário vazio)
router.get('/add', function (req, res) {
    res.render("exposicoes-add", { resultado: {} });
});

// Rota para incluir uma nova exposição via POST
router.post('/add', function (req, res) {
    let titulo = req.body.titulo;
    let duracao = req.body.duracao;
    let dtinicio = req.body.dtinicio;
    let dtfim = req.body.dtfim;
    
    let cmd = "INSERT INTO TbExposicao (TituloExposicao, DuracaoExposicao, DtInicioExposicao, DtFimExposicao) VALUES (?, ?, ?, ?);";
    db.query(cmd, [titulo, duracao, dtinicio, dtfim], function (erro) {
        if (erro) {
            res.send(erro);
        }
        res.redirect('/exposicoes/listar');
    });
});

// Rota para carregar os dados atuais de uma exposição para edição
router.get('/edit/:id', function (req, res) {
    let id = req.params.id;
    let cmd = "SELECT * FROM TbExposicao WHERE IdExposicao = ?;";
    db.query(cmd, [id], function (erro, listagem) {
        if (erro) {
            res.send(erro);
        }
        // NÃO formata as datas para manter o valor original (Date) e possibilitar conversão para ISO na view
        res.render('exposicoes-add', { resultado: listagem[0] });
    });
});

// Rota para alterar dados da exposição via PUT (usada na edição por AJAX)
router.put('/edit/:id', function (req, res) {
    let id = req.params.id;
    let titulo = req.body.titulo;
    let duracao = req.body.duracao;
    let dtinicio = req.body.dtinicio;
    let dtfim = req.body.dtfim;
    
    let cmd = "UPDATE TbExposicao SET TituloExposicao = ?, DuracaoExposicao = ?, DtInicioExposicao = ?, DtFimExposicao = ? WHERE IdExposicao = ?;";
    db.query(cmd, [titulo, duracao, dtinicio, dtfim, id], function (erro) {
        if (erro) {
            res.send(erro);
        }
        res.redirect(303, '/exposicoes/listar');
    });
});

// Rota para excluir uma exposição
router.delete('/delete/:id', function (req, res) {
    let id = req.params.id;
    let cmd = "DELETE FROM TbExposicao WHERE IdExposicao = ?;";
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
