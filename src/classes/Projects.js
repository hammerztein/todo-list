import Todo from './Todo.js';

export default class Project {
	constructor(id, title, todos = []) {
		this.id = id;
		this.title = title;
		this.todos = todos;
	}

	static fromJSON(project) {
		if (Array.isArray(project.todos)) {
			const todoInstances = project.todos.map((todo) => Todo.fromJSON(todo));
			return new Project(project.id, project.title, todoInstances);
		}
	}

	addTodo(todo) {
		this.todos.push(todo);
	}

	removeTodo(todoId) {
		this.todos = this.todos.filter((todo) => todo.id !== todoId);
	}

	updateFields(newValuesObj) {
		for (const key in newValuesObj) {
			if (!(key in this)) return;
			this[key] = newValuesObj[key];
		}
	}
}

