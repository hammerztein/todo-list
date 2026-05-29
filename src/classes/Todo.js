export default class Todo {
	constructor(id, title, status, date) {
		this.id = id;
		this.title = title;
		this.status = status;
		this.date = date;
	}

	static fromJSON(todo) {
		return new Todo(todo.id, todo.title, todo.status, todo.date);
	}

	updateFields(newValuesObj) {
		for (const key in newValuesObj) {
			if (!(key in this)) return;
			this[key] = newValuesObj[key];
		}
	}
}

