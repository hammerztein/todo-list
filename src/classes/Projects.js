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

	addTodo(todoObj) {
		const { id, title, status, date } = todoObj;
		const todo = new Todo(id, title, status, date);
		this.todos.push(todo);
	}

	editTodo(updatedTodo) {
		const editableTodo = this.todos.find((todo) => todo.id === updatedTodo.id);
		editableTodo.updateFields(updatedTodo);
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

