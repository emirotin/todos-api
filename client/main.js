(function(Ractive, fetch) {

	var app = new Ractive({
		el: '#root',
		template: '#tmpl-app',
		data: {}
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
