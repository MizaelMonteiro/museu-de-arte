var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var autoresRouter = require('./routes/autores');
var nacionalidadesRouter = require('./routes/nacionalidades');
var obrasRouter = require('./routes/obras');
var sessoesRouter = require('./routes/sessoes');
var exposicoesRouter = require('./routes/exposicoes');
var visitantesRouter = require('./routes/visitantes');
var funcionariosRouter = require('./routes/funcionarios');
var introducaoRouter = require('./routes/introducao');
var levantamentosRouter = require('./routes/levantamentos');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/autores', autoresRouter);
app.use('/nacionalidades', nacionalidadesRouter);
app.use('/obras', obrasRouter);
app.use('/sessoes', sessoesRouter);
app.use('/exposicoes', exposicoesRouter);
app.use('/visitantes', visitantesRouter);
app.use('/funcionarios', funcionariosRouter);
app.use('/introducao', introducaoRouter);
app.use('/levantamentos', levantamentosRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
