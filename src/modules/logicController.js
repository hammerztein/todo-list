import { saveToStorage, loadFromStorage } from './store.js';
import Project from '../classes/Projects.js';

const projects = loadFromStorage().map(Project.fromJSON);

const saveProjects = () => {
	saveToStorage(projects);
};

const createDefaultProject = () => {
	const id = crypto.randomUUID();
	const defaultProject = new Project(id, 'Default Project');
	projects.push(defaultProject);
	saveProjects();
};

export const getAllProjects = () => {
	if (projects.length === 0) {
		createDefaultProject();
	}

	return [...projects];
};

export const getProject = (projectId) => {
	return projects.find((project) => project.id === projectId);
};

export const addProject = (projectTitle) => {
	const id = crypto.randomUUID();
	const newProject = new Project(id, projectTitle);
	projects.push(newProject);
	saveProjects();
};

export const deleteProject = (projectId) => {
	const projectsIndex = projects.findIndex(
		(project) => project.id === projectId,
	);
	projects.splice(projectsIndex, 1);
	saveProjects();
};

export const editProject = (editFormData) => {
	const projectToEdit = getProject(editFormData.id);
	projectToEdit.updateFields(editFormData);
	saveProjects();
};

export const getTodo = (projectId, todoId) => {
	return getProject(projectId).getTodo(todoId);
};

export const getTodos = (projectId) => {
	return getProject(projectId).getTodos();
};

export const addTodo = (projectId, todoObj) => {
	todoObj.id = crypto.randomUUID();
	getProject(projectId).addTodo(todoObj);
	saveProjects();
};

export const getTodosStatusCount = (projectId) => {
	const todos = getTodos(projectId);
	return {
		done: todos.filter((todo) => todo.status === 'true').length,
		notDone: todos.filter((todo) => todo.status === 'false').length,
	};
};

export const editTodo = (projectId, editFormData) => {
	getProject(projectId).editTodo(editFormData);
	saveProjects();
};

export const deleteTodo = (projectId, todoId) => {
	getProject(projectId).removeTodo(todoId);
	saveProjects();
};
