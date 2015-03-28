var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');

var mongoose = require('mongoose');

var app = express();
app.use(bodyParser.json());
app.use(compression());

mongoose.connect('mongodb://localhost:27017/todo');

// models
var Todo = mongoose.model('Todo', {
	task: String,
	completed: {
		type: Boolean,
		default: false
	}
});

app.get('/api/todos', function (req, res) {
	Todo.find({}, function (err, todos) {
		if (err) {
			console.error(err);
			res.status(500).end()
		} else {
			res.json(todos);
		}
	});
});

app.get('/api/todos/:todoId', function (req, res) {
	var todoId = req.params.todoId;
	Todo.findById(todoId, function (err, todo) {
		if (err) {
			if (err.message.match(/Cast to ObjectId failed/)) {
				return res.status(404).end();
			}
			console.error(err);
			return res.status(500).end();
		}
		if (!todo) {
			return res.status(404).end();
		}
		res.json(todo);
	});
});

app.post('/api/todos', function (req, res) {
	Todo.create(req.body, function(err, todo) {
		if (err) {
			console.error(err);
			res.status(500).end()
		} else {
			res.json(todo);
		}
	});
});

//app.put('/api/todos/:todoId') -> update one
//app.patch('/api/todos/:todoId') -> update one
//app.delete('/api/todos/:todoId') -> delete one

var db = mongoose.connection;
db.on('error', function (err){
	console.error('connection error:', err);
});

db.once('open', function (callback) {
	var port = 8080;
	app.listen(port);
	console.log('Listening on http://localhost:' + port);
});
