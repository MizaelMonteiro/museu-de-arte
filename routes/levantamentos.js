let express = require('express');
let db = require('../utils/db');
let router = express.Router();
const moment = require('moment');




router.get('/levantamentos', function (req, res) {
        res.render('levantamentos');

});

router.get('/visitasexposicoes', function (req, res) {
        let query = `
          SELECT e.IdExposicao, e.TituloExposicao, COUNT(ve.IdVisitante) AS total_visitas
          FROM TbExposicao e
          JOIN TbVisitanteExposicao ve ON e.IdExposicao = ve.IdExposicao
          GROUP BY e.IdExposicao, e.TituloExposicao
          ORDER BY total_visitas DESC;
        `;

        db.query(query, [], function (err, results) {
                if (err) {
                        return res.send(err);
                }
                res.render('levantamentos-visitasexposicoes', { resultado: results });
        });
});



router.get('/exposicoesativas', function (req, res) {
        // Seleciona todas as exposições
        let query = "SELECT * FROM TbExposicao ORDER BY TituloExposicao";
        db.query(query, [], function (err, exposicoes) {
                if (err) {
                        return res.send(err);
                }

                let hoje = moment();
                exposicoes = exposicoes.map(exp => {
                        // Se a duração for "Permanente" (ignora maiúsculas/minúsculas)
                        if (exp.DuracaoExposicao.trim().toLowerCase() === 'permanente') {
                                exp.status = 'Sempre ativa';
                                exp.dtInicioFormatada = '';
                                exp.dtFimFormatada = '';
                        } else {
                                let dtInicio = moment(exp.DtInicioExposicao);
                                let dtFim = moment(exp.DtFimExposicao);
                                exp.dtInicioFormatada = dtInicio.format('DD/MM/YYYY');
                                exp.dtFimFormatada = dtFim.format('DD/MM/YYYY');
                                if (hoje.isBetween(dtInicio, dtFim, 'day', '[]')) {
                                        exp.status = 'Ativa';
                                        exp.ate = dtFim.format('DD/MM/YYYY');
                                } else {
                                        exp.status = 'Inativa';
                                        exp.ate = null;
                                }
                        }
                        return exp;
                });

                res.render('levantamentos-exposicoesativas', { resultado: exposicoes, moment: moment });
        });
});


router.get('/qtdobrasautor', function (req, res) {
        let sql = `
          SELECT a.IdAutor, a.NoAutor, COUNT(o.IdObra) AS total_obras
          FROM TbAutor a
          LEFT JOIN TbObra o ON a.IdAutor = o.IdAutor
          GROUP BY a.IdAutor, a.NoAutor
          ORDER BY total_obras DESC;
        `;

        db.query(sql, [], function (err, results) {
                if (err) {
                        return res.send(err);
                }
                res.render('levantamentos-qtdobrasautor', { resultado: results });
        });
});


router.get('/funcionariossessao', function (req, res) {
        let sql = `
          SELECT s.IdSessao, s.NoSessao, COUNT(f.IdFuncionario) AS total_funcionarios
          FROM TbSessao s
          LEFT JOIN TbFuncionario f ON s.IdSessao = f.IdSessao
          GROUP BY s.IdSessao, s.NoSessao
          ORDER BY total_funcionarios DESC;
        `;

        db.query(sql, [], function (err, results) {
                if (err) {
                        return res.send(err);
                }
                res.render('levantamentos-funcionariossessao', { resultado: results });
        });
});


module.exports = router;

