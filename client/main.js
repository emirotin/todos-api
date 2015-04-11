(function(Ractive, fetch) {

	var app = new Ractive({
		el: '#root',
		template: '#tmpl-app',
		data: {}
	});

	app.on('begin-edit', function(event, i, currentTask){
		app.set('todos.' + i + '.isEditing', true);
		app.set('todos.' + i + '.newTask', currentTask);
		return false;
	});

	app.on('save-edit', function(event, i, currentTodo){
		app.set('todos.' + i + '.isEditing', false);
		app.set('todos.' + i + '.task', currentTodo.newTask);

		fetch('/api/todos/' + currentTodo._id, {
			method: 'PATCH',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ task: currentTodo.newTask })
		});

		return false;
	});

	app.on('cancel-edit', function(event, i){
		app.set('todos.' + i + '.isEditing', false);
		return false;
	});

	fetch('/api/todos')
	.then(function(response) {
		return response.json();
	})
	.then(function(todos) {
		app.set('todos', todos);
	})
	.catch(function(err) {
		console.log('WTF', err);
	});


}(window.Ractive, window.fetch));
