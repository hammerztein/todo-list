import {
	addProject,
	deleteProject,
	editProject,
	getAllProjects,
	getProject,
	getTodo,
	addTodo,
	getTodosStatusCount,
	editTodo,
	deleteTodo,
} from './logicController.js';
import {
	getActiveProjectId,
	getModalType,
	getModalAction,
	getEditProjectId,
	setActiveProjectId,
	setModalType,
	setModalAction,
	setEditProjectId,
	setEditTodoId,
	getEditTodoId,
} from './stateManager.js';
import { formatDate } from '../utils/date.js';
import { renderProjects, renderTodos } from './render.js';
import { capitalizeWord } from '../utils/formatText.js';
import { checkValidInputs } from '../utils/formValidation.js';

const projectElements = {
	modal: document.querySelector('#project-modal'),
	addProjectBtn: document.querySelector('#add-project-btn'),
	form: document.querySelector('.project-form'),
	formTitle: document.querySelector('.project-form header h3'),
	projectTitleInput: document.querySelector('#project-title'),
	list: document.querySelector('.projects'),
	formBtn: document.querySelector(".project-form button[type='submit']"),
};

const todoElements = {
	modal: document.querySelector('#todo-modal'),
	addTodoBtn: document.querySelector('#add-todo-btn'),
	form: document.querySelector('.todo-form'),
	formTitle: document.querySelector('.todo-form header h3'),
	todoTitleInput: document.querySelector('#todo-title'),
	todoStatusInput: document.querySelector('#todo-status'),
	todoDateInput: document.querySelector('#todo-date'),
	formBtn: document.querySelector(".todo-form button[type='submit']"),
	todoContainer: document.querySelector('.todo-sections'),
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

const createDefaultProject = () => {};

const refreshProjects = () => {
	const projects = getAllProjects();
	const activeProjectId = getActiveProjectId();
	renderProjects(projects, projectElements.list, activeProjectId);
	if (!activeProjectId) todoElements.addTodoBtn.setAttribute('disabled', true);
	if (activeProjectId) {
		refreshTodos(activeProjectId);
		todoElements.addTodoBtn.removeAttribute('disabled');
	}
};

const refreshTodos = (activeProjectId) => {
	const project = getProject(activeProjectId);
	const { doneList, notDoneList } = todoElements;
	if (!project) {
		renderTodos([], { doneList, notDoneList });
	} else {
		renderTodos(project.todos, { doneList, notDoneList });
	}

	setTodoCount(activeProjectId);
};

const resetModalForm = (modal, form) => {
	modal.close();
	form.reset();
	form.classList.remove('submitted');
};

const resetActiveProject = (id) => {
	const activeProjectId = getActiveProjectId();
	if (id === activeProjectId) {
		setActiveProjectId(null);
		refreshTodos(null);
	}
};

const setProjectEditFields = (id) => {
	const project = getProject(id);
	projectElements.projectTitleInput.value = project.title;
};

const setTodoEditFields = (id) => {
	const activeProjectId = getActiveProjectId();
	const todo = getTodo(activeProjectId, id);
	todoElements.todoTitleInput.value = todo.title;
	todoElements.todoStatusInput.value = todo.status;
	todoElements.todoDateInput.value = todo.date;
};

const setFormContent = (form) => {
	const type = getModalType();
	const action = getModalAction();
	const { formTitle, formBtn } = form;
	formTitle.textContent = `${capitalizeWord(action)} ${capitalizeWord(type)}`;
	formBtn.textContent = `${capitalizeWord(action)} ${capitalizeWord(type)}`;
};

const handleOpenModal = () => {
	const modalType = getModalType();

	if (modalType === 'project') {
		resetModalForm(projectElements.modal, projectElements.form);
		projectElements.modal.showModal();
	}

	if (modalType === 'todo') {
		resetModalForm(todoElements.modal, todoElements.form);
		todoElements.modal.showModal();
	}
};

const handleCloseModal = () => {
	const modalType = getModalType();
	if (modalType === 'project') {
		resetModalForm(projectElements.modal, projectElements.form);
		projectElements.modal.close();
	}

	if (modalType === 'todo') {
		resetModalForm(todoElements.modal, todoElements.form);
		todoElements.modal.close();
	}
};

const handleProjectActions = (e) => {
	const listEl = e.target.closest('li');
	const actionBtn = e.target.closest('.action-btn');

	if (!listEl && !actionBtn) {
		return;
	}

	const { id } = listEl.dataset;

	if (actionBtn) {
		const { action } = actionBtn.dataset;

		if (action === 'edit') {
			setModalType('project');
			setModalAction('edit');
			setEditProjectId(id);
			setFormContent(projectElements);
			handleOpenModal();
			setProjectEditFields(id);
		}

		if (action === 'delete') {
			resetActiveProject(id);
			handleDeleteProject(id);
			refreshProjects();
		}
	}

	if (listEl && !actionBtn) {
		setActiveProjectId(id);
		refreshProjects();
	}
};

const handleAddProject = (projectTitle) => {
	addProject(projectTitle);
};

const handleEditProject = (projectId, projectTitle) => {
	editProject(projectId, projectTitle);
};

const handleDeleteProject = (projectId) => {
	deleteProject(projectId);
};

const handleProjectFormSubmit = (e) => {
	e.preventDefault();
	const isFormValid = checkValidInputs(projectElements.form);
	if (!isFormValid) {
		projectElements.form.classList.add('submitted');
		return;
	}
	const modalAction = getModalAction();

	if (modalAction === 'add') {
		handleAddProject(projectElements.projectTitleInput.value);
	}

	if (modalAction === 'edit') {
		const editFormData = {
			id: getEditProjectId(),
			title: projectElements.projectTitleInput.value,
		};
		handleEditProject(editFormData);
	}

	handleCloseModal();
	refreshProjects();
};

const handleAddBtnClick = (e) => {
	const { action, type } = e.currentTarget.dataset;
	setModalType(type);
	setModalAction(action);
	const formElements = {
		formTitle: null,
		formBtn: null,
	};
	if (type === 'project') {
		formElements.formTitle = projectElements.formTitle;
		formElements.formBtn = projectElements.formBtn;
	}

	if (type === 'todo') {
		formElements.formTitle = todoElements.formTitle;
		formElements.formBtn = todoElements.formBtn;
	}
	setFormContent(formElements);
	handleOpenModal();
};

const handleAddTodo = (projectId, todoObj) => {
	addTodo(projectId, todoObj);
};

const handleEditTodo = (projectId, editFormData) => {
	editTodo(projectId, editFormData);
};

const handleDeleteTodo = (activeProjectId, id) => {
	deleteTodo(activeProjectId, id);
};

const handleTodoActions = (e) => {
	const listEl = e.target.closest('li');
	const actionBtn = e.target.closest('.action-btn');

	if (!listEl && !actionBtn) {
		return;
	}

	const { id } = listEl.dataset;

	if (actionBtn) {
		const { action } = actionBtn.dataset;

		if (action === 'edit') {
			setModalType('todo');
			setModalAction('edit');
			setEditTodoId(id);
			setFormContent(todoElements);
			handleOpenModal();
			setTodoEditFields(id);
		}

		if (action === 'delete') {
			const activeProjectId = getActiveProjectId();
			handleDeleteTodo(activeProjectId, id);
			refreshTodos(activeProjectId);
		}
	}
};

const handleTodoFormSubmit = (e) => {
	e.preventDefault();
	const isFormValid = checkValidInputs(todoElements.form);
	if (!isFormValid) {
		todoElements.form.classList.add('submitted');
		return;
	}
	const modalAction = getModalAction();
	const activeProjectId = getActiveProjectId();
	const todoObj = {
		title: todoElements.todoTitleInput.value,
		status: todoElements.todoStatusInput.value,
		date: todoElements.todoDateInput.value,
	};

	if (modalAction === 'add') {
		handleAddTodo(activeProjectId, todoObj);
	}

	if (modalAction === 'edit') {
		todoObj.id = getEditTodoId();
		handleEditTodo(activeProjectId, todoObj);
	}

	handleCloseModal();
	refreshTodos(activeProjectId);
};

const registerEventListeners = () => {
	projectElements.list.addEventListener('click', handleProjectActions);
	projectElements.addProjectBtn.addEventListener('click', handleAddBtnClick);
	projectElements.form.addEventListener('submit', handleProjectFormSubmit);
	todoElements.todoContainer.addEventListener('click', handleTodoActions);
	todoElements.addTodoBtn.addEventListener('click', handleAddBtnClick);
	todoElements.form.addEventListener('submit', handleTodoFormSubmit);
};

export { refreshProjects, registerEventListeners };

