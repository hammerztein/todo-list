import { saveToStorage, loadFromStorage } from './store.js';
import Project from './classes/Projects.js';

export const addProject = (projectTitle) => {
	const id = crypto.randomUUID();
	const projects = loadFromStorage();
	const newProject = new Project(id, projectTitle);
	projects.push(newProject);
	saveToStorage(projects);
};

export const getAllProjects = () => {
	const projects = loadFromStorage();
	const rehydratedProjects = projects.map((project) =>
		Project.fromJSON(project),
	);

	return rehydratedProjects;
};

export const getProject = (projectId) => {
	const projects = getAllProjects();
	return projects.find((project) => project.id === projectId);
};

export const deleteProject = (projectId) => {
	const projects = loadFromStorage();
	const projectsToKeep = projects.filter((project) => project.id !== projectId);
	saveToStorage(projectsToKeep);
};

export const editProject = (editFormData) => {
	const projects = getAllProjects();
	const { id, title } = editFormData;
	const projectToEdit = projects.find((project) => project.id === id);
	projectToEdit.updateFields(editFormData);
	saveToStorage(projects);
};

export const addTodo = (projectId, todoObj) => {
	const projects = getAllProjects();
	const projectToAddTodo = projects.find((project) => project.id === projectId);
	todoObj.id = crypto.randomUUID();
	projectToAddTodo.addTodo(todoObj);
	saveToStorage(projects);
};

export const getTodos = (projectId) => {
	const project = getProject(projectId);
	return project.todos;
};

export const getTodosStatusCount = (projectId) => {
	const todos = getTodos(projectId);
	const doneTodoCount = todos.filter((todo) => todo.status === 'true').length;
	const notDoneTodoCount = todos.filter(
		(todo) => todo.status === 'false',
	).length;
	return {
		done: doneTodoCount,
		notDone: notDoneTodoCount,
	};
};

export const editTodo = (projectId, editFormData) => {
	const projects = getAllProjects();
	const projectToUpdateTodo = projects.find(
		(project) => project.id === projectId,
	);
	projectToUpdateTodo.editTodo(editFormData);

	saveToStorage(projects);
};

export const deleteTodo = (projectId, todoId) => {
	const projects = getAllProjects();
	const projectToDeleteTodo = projects.find(
		(project) => project.id === projectId,
	);
	projectToDeleteTodo.removeTodo(todoId);
	saveToStorage(projects);
};

