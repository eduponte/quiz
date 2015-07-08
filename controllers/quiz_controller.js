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
  res.render('quizes/show', {quiz: req.quiz, errors: []});
}

exports.edit = function(req, res) {
  res.render('quizes/edit', {quiz: req.quiz, errors: []});
}

exports.answer = function(req, res) {
  res.render('quizes/answer', {
    quiz: req.quiz,
    respuesta: ((req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase()) ? 'Correcto' : 'Incorrecto'),
		errors: []
  });
}

exports.index = function(req, res) {
	var findOptions = {
		where: {},
		order: [['pregunta', 'ASC']]
	};
	if (req.query.search) {
		findOptions.where.pregunta = {
			$like: '%'+req.query.search.replace(' ','%')+'%'
		}
	}
	if (req.query.cat) {
		findOptions.where.tema = req.query.cat;
	}
  models.Quiz.findAll(findOptions).then(function(quizes) {
    res.render('quizes/index.ejs', {quizes: quizes, errors: []});
  });
}

exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
};

exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	quiz.validate().then(function(err) {
		if (err) {
			res.render('quizes/new', {quiz: quiz, errors:err.errors});
		} else {
			quiz.save({fields: ['pregunta','respuesta','tema']}).then(function() {
				res.redirect('/quizes');
			});
		}
	});
};

exports.destroy = function(req, res) {
	req.quiz.destroy().then(function() {
		res.redirect('/quizes');
	}).catch(function(error) {next(error);});
};

exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz.validate().then(function(err) {
		if (err) {
			res.render('quizes/edit', {quiz: req.quiz, errors:err.errors});
		} else {
			req.quiz.save({fields: ['pregunta','respuesta','tema']}).then(function() {
				res.redirect('/quizes');
			});
		}
	});
};

exports.author = function(req, res) {
  res.render('author', {errors: []});
}
