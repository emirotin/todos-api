var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');

var mongoose = require('mongoose');

var app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client'));

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
	var filter = {};

	var completed = req.query.completed;
	if (completed) {
		completed = completed.toLowerCase();
		if (completed !== 'true' && completed !== 'false') {
			completed = null;
		}
	}
	if (completed) {
		filter.completed = (completed === 'true');
	}

	Todo.find(filter, function (err, todos) {
		if (err) {
			console.error(err);
			res.status(500).end();
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
			res.status(500).end();
		} else {
			res.json(todo);
		}
	});
});

app.put('/api/todos/:todoId', function (req, res) {
	var todoId = req.params.todoId;
	Todo.update({ _id: todoId }, req.body, function(err) {
		if (err) {
			console.error(err);
			res.status(500).end();
		} else {
			res.send();
		}
	});
});

app.patch('/api/todos/:todoId', function (req, res) {
	var todoId = req.params.todoId;
	Todo.update({ _id: todoId }, { $set: req.body }, function(err) {
		if (err) {
			console.error(err);
			res.status(500).end();
		} else {
			res.send();
		}
	});
});

app.delete('/api/todos/:todoId', function (req, res) {
	var todoId = req.params.todoId;
	Todo.remove({ _id: todoId }, function (err) {
		if (err) {
			console.error(err);
			res.status(500).end();
		} else {
			res.send();
		}
	})
});

var db = mongoose.connection;
db.on('error', function (err){
	console.error('connection error:', err);
});

db.once('open', function (callback) {
	var port = process.env.PORT || 8080;
	app.listen(port);
	console.log('Listening on http://localhost:' + port);
});
