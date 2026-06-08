import {
	addProject,
	deleteProject,
	editProject,
	getAllProjects,
	getProject,
	addTodo,
} from './logicController.js';

const elements = {
	openProjectModalBtn: document.querySelector('#add-project-btn'),
	projectModal: document.querySelector('#project-modal'),
	projectForm: document.querySelector('.project-form'),
	projectFormTitleInput: document.querySelector('#project-title'),
	projectList: document.querySelector('.projects'),
	projectFormBtn: document.querySelector(".project-form button[type='submit']"),
	contentContainer: document.querySelector('.container .content'),
	openTodoModalBtn: document.querySelector('#add-todo-btn'),
	todoModal: document.querySelector('#todo-modal'),
	todoForm: document.querySelector('.todo-form'),
	todoFormTitleInput: document.querySelector('#todo-title'),
	todoFormStatusInput: document.querySelector('#todo-status'),
	todoFormDateInput: document.querySelector('#todo-date'),
	todoFormBtn: document.querySelector(".todo-form button[type='submit']"),
};

const clearProjectsContainer = () => {
	const children = [...elements.projectList.childNodes];
	children.forEach((child) => {
		elements.projectList.removeChild(child);
	});
};

const createProjectElement = (project) => {
	const listEl = document.createElement('li');
	listEl.dataset.id = project.id;
	const projectTitle = document.createElement('span');
	projectTitle.textContent = project.title;
	const btnContainer = document.createElement('div');
	btnContainer.className = 'controls';
	const editBtn = document.createElement('button');
	const delBtn = document.createElement('button');
	editBtn.innerHTML =
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>';
	editBtn.dataset.buttonType = 'edit';
	delBtn.innerHTML =
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>';
	editBtn.addEventListener('click', (e) => handleProjectEdit(e, project));
	delBtn.addEventListener('click', () => handleDeleteProject(project.id));
	btnContainer.appendChild(editBtn);
	btnContainer.appendChild(delBtn);
	listEl.appendChild(projectTitle);
	listEl.appendChild(btnContainer);
	return listEl;
};

const createProjectList = (projects) => {
	projects.forEach((project) => {
		const projectListEntry = createProjectElement(project);
		elements.projectList.appendChild(projectListEntry);
	});
};

const renderProjects = () => {
	const projects = getAllProjects();
	clearProjectsContainer();
	createProjectList(projects);
	setActiveProjectClass();
	renderTodos();
};

const renderTodos = () => {
	const { id } = elements.contentContainer.dataset;

	if (!id) {
		elements.openTodoModalBtn.setAttribute('disabled', true);
	}

	if (id) {
		const project = getProject(id);
		const todos = project.todos;
		elements.openTodoModalBtn.removeAttribute('disabled');

		if (todos.length === 0) {
			// Render empty placeholders
		} else {
			// Render todos
		}
	}
};

const setProjectEditFields = (project) => {
	elements.projectFormTitleInput.value = project.title;
	elements.projectForm.dataset.projectId = project.id;
};

const setProjectModalType = (e) => {
	elements.projectForm.classList.remove('submitted');
	const { buttonType } = e.currentTarget.dataset;
	elements.projectFormBtn.textContent = `${buttonType[0]
		.toUpperCase()
		.concat(buttonType.slice(1))} Project`;
	elements.projectModal.dataset.type = buttonType;
	elements.projectForm.reset();
};

const setTodoModalType = (e) => {
	elements.todoForm.classList.remove('submitted');
	const { buttonType } = e.currentTarget.dataset;
	elements.todoFormBtn.textContent = `${buttonType[0]
		.toUpperCase()
		.concat(buttonType.slice(1))} Todo`;
	elements.todoModal.dataset.type = buttonType;
	elements.todoForm.reset();
};

const openEditModal = () => {
	elements.projectForm.classList.remove('submitted');
	elements.projectModal.showModal();
};

const handleProjectEdit = (e, project) => {
	setProjectModalType(e);
	openEditModal();
	setProjectEditFields(project);
};

const handleProjectFormSubmit = (e) => {
	e.preventDefault();

	if (elements.projectFormTitleInput.value === ' ') {
		elements.projectForm.classList.add('submitted');
		return;
	}

	if (elements.projectModal.dataset.type === 'add') {
		const projectTitle = elements.projectFormTitleInput.value;
		addProject(projectTitle);
	}

	if (elements.projectModal.dataset.type === 'edit') {
		const projectFormData = {
			id: elements.projectForm.dataset.projectId,
			title: elements.projectFormTitleInput.value,
		};
		editProject(projectFormData);
	}

	elements.projectForm.classList.remove('submitted');
	elements.projectModal.close();
	renderProjects();
};

const handleTodoFormSubmit = (e) => {
	e.preventDefault();

	if (
		elements.todoFormTitleInput.value === ' ' ||
		elements.todoFormStatusInput.value === ' '
	) {
		elements.todoForm.classList.add('submitted');
		return;
	}
	if (elements.todoModal.dataset.type === 'add') {
		const { id } = elements.contentContainer.dataset;
		const todoFormData = {
			title: elements.todoFormTitleInput.value,
			status: elements.todoFormStatusInput.value,
			date: elements.todoFormDateInput.value,
		};
		addTodo(id, todoFormData);
	}

	elements.todoForm.classList.remove('submitted');
	elements.todoModal.close();
	renderTodos();
};

const handleDeleteProject = (projectId) => {
	deleteProject(projectId);
	clearActiveProject(projectId);
	renderProjects();
};

const setActiveProject = (e) => {
	const click = e.target;
	if (click.closest('.controls')) {
		return;
	}
	const listEl = click.closest('li');
	if (listEl) {
		const { id } = listEl.dataset;
		elements.contentContainer.dataset.id = id;
		clearActiveProjectsClass();
		setActiveProjectClass();
		renderTodos();
	}
};

const clearActiveProject = (projectId) => {
	if (projectId === elements.contentContainer.dataset.id) {
		elements.contentContainer.removeAttribute('data-id');
	}
};

const clearActiveProjectsClass = () => {
	const projects = [...elements.projectList.children];
	projects.forEach((project) => project.classList.remove('selected'));
};

const setActiveProjectClass = () => {
	const projects = [...elements.projectList.children];
	const activeProjectId = elements.contentContainer.dataset.id;
	projects.forEach((project) => {
		if (project.dataset.id === activeProjectId) {
			project.classList.add('selected');
		}
	});
};

const registerEventListeners = () => {
	elements.projectForm.addEventListener('submit', handleProjectFormSubmit);
	elements.openProjectModalBtn.addEventListener('click', setProjectModalType);
	elements.projectList.addEventListener('click', setActiveProject);
	elements.todoForm.addEventListener('submit', handleTodoFormSubmit);
	elements.openTodoModalBtn.addEventListener('click', setTodoModalType);
};

export { renderProjects, registerEventListeners };
