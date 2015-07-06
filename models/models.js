var path = require('path');

var Sequelize = require('sequelize');

var sequelize = new Sequelize(null, null, null,
  { dialect:  'sqlite',
    // protocol: protocol,
    // port:     port,
    // host:     host,
    storage:  'quiz.sqlite',
    // omitNull: true
  }
);

var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz;

// initialize quiz table
sequelize.sync().success(function() {
  // runs handler once created
  Quiz.count().success(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      Quiz.create(
        {pregunta: 'Capital de Italia',   respuesta: 'Roma'}
      ).success(function(){console.log('Base de datos inicializada')});
    };
  });
});
