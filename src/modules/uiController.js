import {
	addProject,
	deleteProject,
	editProject,
	getAllProjects,
	getProject,
	addTodo,
	getTodosStatusCount,
	editTodo,
	deleteTodo,
} from './logicController.js';
import { getActiveProjectId, setActiveProjectId } from './stateManager.js';
import { formatDate } from '../utils/date.js';
import { renderProjects, renderTodos } from './render.js';

const projectElements = {
	modal: document.querySelector('#project-modal'),
	modalBtn: document.querySelector('#add-project-btn'),
	form: document.querySelector('.project-form'),
	formTitleInput: document.querySelector('#project-title'),
	list: document.querySelector('.projects'),
	formBtn: document.querySelector(".project-form button[type='submit']"),
	container: document.querySelector('.container .content'),
};

const todoElements = {
	modal: document.querySelector('#todo-modal'),
	modalBtn: document.querySelector('#add-todo-btn'),
	form: document.querySelector('.todo-form'),
	formTitleInput: document.querySelector('#todo-title'),
	formStatusInput: document.querySelector('#todo-status'),
	formDateInput: document.querySelector('#todo-date'),
	formBtn: document.querySelector(".todo-form button[type='submit']"),
	doneList: document.querySelector('#done-todos .todos'),
	notDoneList: document.querySelector('#not-done-todos .todos'),
	doneCount: document.querySelector('#not-done-count'),
	notDoneCount: document.querySelector('#done-count'),
};

const setTodoCount = (projectId) => {
	if (!projectId) {
		todoElements.doneCount.textContent = 0;
		todoElements.notDoneCount.textContent = 0;
	} else {
		const todoStatuses = getTodosStatusCount(projectId);
		todoElements.doneCount.textContent = todoStatuses.notDone;
		todoElements.notDoneCount.textContent = todoStatuses.done;
	}
};

const refreshProjects = () => {
	const projects = getAllProjects();
	const activeProjectId = getActiveProjectId();
	renderProjects(projects, projectElements.list, activeProjectId);
	refreshTodos(activeProjectId);
};

const refreshTodos = (activeProjectId) => {
	if (!activeProjectId) {
		todoElements.modalBtn.setAttribute('disabled', true);
	}
	if (activeProjectId) {
		todoElements.modalBtn.removeAttribute('disabled');
		const project = getProject(activeProjectId);
		const todos = project.todos;
		const { doneList, notDoneList } = todoElements;
		renderTodos(todos, activeProjectId, { doneList, notDoneList });
	}
	setTodoCount(activeProjectId);
};

const setProjectEditFields = (project) => {
	projectElements.formTitleInput.value = project.title;
	projectElements.form.dataset.projectId = project.id;
};

const setTodoEditFields = (todo) => {
	todoElements.formTitleInput.value = todo.title;
	todoElements.formStatusInput.value = todo.status;
	todoElements.form.dataset.todoId = todo.id;
	todoElements.formDateInput.value = todo.date;
};

const setProjectModalType = (e) => {
	projectElements.form.classList.remove('submitted');
	const { buttonType } = e.currentTarget.dataset;
	projectElements.formBtn.textContent = `${buttonType[0]
		.toUpperCase()
		.concat(buttonType.slice(1))} Project`;
	projectElements.modal.dataset.type = buttonType;
	projectElements.form.reset();
};

const setTodoModalType = (e) => {
	todoElements.form.classList.remove('submitted');
	const { buttonType } = e.currentTarget.dataset;
	todoElements.formBtn.textContent = `${buttonType[0]
		.toUpperCase()
		.concat(buttonType.slice(1))} Todo`;
	todoElements.modal.dataset.type = buttonType;
	todoElements.form.reset();
};

const openEditModal = (type) => {
	if (type === 'project') {
		projectElements.form.classList.remove('submitted');
		projectElements.modal.showModal();
	}

	if (type === 'todo') {
		todoElements.form.classList.remove('submitted');
		todoElements.modal.showModal();
	}
};

const closeModal = (type) => {
	if (type === 'project') {
		projectElements.form.classList.remove('submitted');
		projectElements.form.removeAttribute('data-project-id');
		projectElements.modal.close();
	}

	if (type === 'todo') {
		todoElements.form.classList.remove('submitted');
		todoElements.form.removeAttribute('data-todo-id');
		todoElements.modal.close();
	}
};

const checkValidInputs = (formElement) => {
	const inputs = [...formElement.elements];
	const requiredInputs = inputs.filter((input) => input.required);

	return !requiredInputs.some((input) => input.value === ' ');
};

const handleProjectEdit = (e, project) => {
	setProjectModalType(e);
	openEditModal('project');
	setProjectEditFields(project);
};

const handleTodoEdit = (e, todo) => {
	setTodoModalType(e);
	openEditModal('todo');
	setTodoEditFields(todo);
};

const handleProjectFormSubmit = (e) => {
	e.preventDefault();
	const isFormValid = checkValidInputs(projectElements.form);
	if (!isFormValid) {
		projectElements.form.classList.add('submitted');
		return;
	}
	const { type } = projectElements.modal.dataset;
	const projectFormData = {
		title: projectElements.formTitleInput.value,
	};

	if (type === 'add') {
		addProject(projectFormData.title);
	}

	if (type === 'edit') {
		projectFormData.id = projectElements.form.dataset.projectId;
		editProject(projectFormData);
	}

	closeModal('project');
	refreshProjects();
};

const handleTodoFormSubmit = (e) => {
	e.preventDefault();
	const isFormValid = checkValidInputs(todoElements.form);
	if (!isFormValid) {
		todoElements.form.classList.add('submitted');
		return;
	}
	const id = getActiveProjectId();
	const { type } = todoElements.modal.dataset;
	const todoFormData = {
		title: todoElements.formTitleInput.value,
		status: todoElements.formStatusInput.value,
		date: todoElements.formDateInput.value || null,
	};

	if (type === 'add') {
		addTodo(id, todoFormData);
	}

	if (type === 'edit') {
		todoFormData.id = todoElements.form.dataset.todoId;
		editTodo(id, todoFormData);
	}

	closeModal('todo');
	refreshTodos(id);
};

const handleDeleteProject = (projectId) => {
	deleteProject(projectId);
	clearActiveProject(projectId);
	renderProjects();
};

const handleDeleteTodo = (projectId, todoId) => {
	deleteTodo(projectId, todoId);
	renderTodos();
};

const handleSetActiveProject = (e) => {
	const click = e.target;
	const listEl = click.closest('li');

	if (click.closest('.controls') || !listEl) {
		return;
	}

	const { id } = listEl.dataset;
	setActiveProjectId(id);
	refreshProjects();
};

const registerEventListeners = () => {
	projectElements.form.addEventListener('submit', handleProjectFormSubmit);
	projectElements.modalBtn.addEventListener('click', setProjectModalType);
	projectElements.list.addEventListener('click', handleSetActiveProject);
	todoElements.form.addEventListener('submit', handleTodoFormSubmit);
	todoElements.modalBtn.addEventListener('click', setTodoModalType);
};

export { refreshProjects, registerEventListeners };
