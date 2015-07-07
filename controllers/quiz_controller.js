var models = require('../models/models.js');

//load
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
		function(quiz) {
			if(quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId:' + quizId));
			}
		}
	).catch(function(error) { next(error); });
};

exports.show = function(req, res) {
  res.render('quizes/show', {quiz: req.quiz});
}

exports.answer = function(req, res) {
  res.render('quizes/answer', {
    quiz: req.quiz,
    respuesta: ((req.query.respuesta === req.quiz.respuesta) ? 'Correcto' : 'Incorrecto')
  });
}

exports.index = function(req, res) {
	var findOptions = (req.query.search) ? {
		where: ['pregunta like ?', '%'+req.query.search.replace(' ','%')+'%'],
		order: [['pregunta', 'ASC']]
	} : {};
  models.Quiz.findAll(findOptions).success(function(quizes) {
    res.render('quizes/index.ejs', {quizes: quizes});
  });
}

exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz});
};

exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	quiz.save({fields: ['pregunta','respuesta']}).then(function() {
		res.redirect('/quizes');
	});
};

exports.author = function(req, res) {
  res.render('author');
}
