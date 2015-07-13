var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {title: 'Quiz', errors: []});
});

// autoloads quizId-aware requests
router.param('quizId', quizController.load);
router.param('commentId', commentController.load);

// quizes routes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new',                  sessionController.loginRequired, quizController.new);
router.post('/quizes/create',              sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequired, quizController.destroy);
router.get('/quizes/statistics',           quizController.statistics);

router.get('/quizes/:quizId(\\d+)/comments/new',  commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',     commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId/publish',     sessionController.loginRequired, commentController.publish);

router.get('/author',                      quizController.author);

router.get('/login',  sessionController.new);     // login form
router.post('/login', sessionController.create);  // create session
router.get('/logout', sessionController.destroy); // destroy session

module.exports = router;
