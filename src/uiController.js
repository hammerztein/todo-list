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
	todoNotDoneList: document.querySelector('#not-done-todos .todos'),
	todoDoneList: document.querySelector('#done-todos .todos'),
};

const formatDate = (dateString) => {
	if (!dateString) return 'No Date';
	const date = new Date(dateString);
	return Intl.DateTimeFormat('en-GB', {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
	}).format(date);
};

const clearContainer = (parent) => {
	const children = [...parent.childNodes];
	children.forEach((child) => {
		parent.removeChild(child);
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
	editBtn.className = 'action-btn';
	delBtn.className = 'action-btn';
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

const createTodoElement = (todo) => {
	const listEl = document.createElement('li');
	listEl.className = 'todo';
	const divLeft = document.createElement('div');
	divLeft.className = 'left';
	const todoTitle = document.createElement('h4');
	todoTitle.className = `done-${todo.status}`;
	todoTitle.textContent = todo.title;
	const dateEl = document.createElement('p');
	dateEl.className = 'todo-date';
	dateEl.innerHTML =
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>calendar-outline</title><path d="M12 12H17V17H12V12M19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 5V7H5V5H19M5 19V9H19V19H5Z" /></svg>';
	const date = formatDate(todo.date);
	const dateText = document.createTextNode(date);
	dateEl.appendChild(dateText);
	divLeft.appendChild(todoTitle);
	divLeft.appendChild(dateEl);
	const divRight = document.createElement('div');
	divRight.className = 'right';
	const editBtn = document.createElement('button');
	const delBtn = document.createElement('button');
	editBtn.className = 'action-btn';
	delBtn.className = 'action-btn';
	editBtn.innerHTML =
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>';
	editBtn.dataset.buttonType = 'edit';
	delBtn.innerHTML =
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>';
	editBtn.addEventListener('click', (e) => handleTodoEdit(e, todo));
	delBtn.addEventListener('click', () =>
		handleDeleteTodo(elements.contentContainer.dataset.id, todo.id),
	);
	divRight.appendChild(editBtn);
	divRight.appendChild(delBtn);
	listEl.appendChild(divLeft);
	listEl.appendChild(divRight);
	return listEl;
};

const createTodoList = (todos) => {
	todos.forEach((todo) => {
		const todoListEntry = createTodoElement(todo);

		if (todo.status === 'true') {
			elements.todoDoneList.appendChild(todoListEntry);
		} else {
			elements.todoNotDoneList.appendChild(todoListEntry);
		}
	});
};

const setTodoCount = (projectId) => {
	const notDoneEl = document.querySelector('#not-done-count');
	const doneEl = document.querySelector('#done-count');
	if (!projectId) {
		notDoneEl.textContent = 0;
		doneEl.textContent = 0;
	} else {
		const todoStatuses = getTodosStatusCount(projectId);
		notDoneEl.textContent = todoStatuses.notDone;
		doneEl.textContent = todoStatuses.done;
	}
};

const renderProjects = () => {
	const projects = getAllProjects();
	clearContainer(elements.projectList);
	createProjectList(projects);
	setActiveProjectClass();
	renderTodos();
};

const renderTodos = () => {
	const { id } = elements.contentContainer.dataset;
	clearContainer(elements.todoNotDoneList);
	clearContainer(elements.todoDoneList);

	if (!id) {
		elements.openTodoModalBtn.setAttribute('disabled', true);
	}

	if (id) {
		const project = getProject(id);
		const todos = project.todos;
		elements.openTodoModalBtn.removeAttribute('disabled');

		if (todos.length !== 0) {
			createTodoList(todos);
		}
	}
	setTodoCount(id);
};

const setProjectEditFields = (project) => {
	elements.projectFormTitleInput.value = project.title;
	elements.projectForm.dataset.projectId = project.id;
};

const setTodoEditFields = (todo) => {
	elements.todoFormTitleInput.value = todo.title;
	elements.todoFormStatusInput.value = todo.status;
	elements.todoForm.dataset.todoId = todo.id;
	elements.todoFormDateInput.value = todo.date;
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

const openEditModal = (type) => {
	if (type === 'project') {
		elements.projectForm.classList.remove('submitted');
		elements.projectModal.showModal();
	}

	if (type === 'todo') {
		elements.todoForm.classList.remove('submitted');
		elements.todoModal.showModal();
	}
};

const closeModal = (type) => {
	if (type === 'project') {
		elements.projectForm.classList.remove('submitted');
		elements.projectForm.removeAttribute('data-project-id');
		elements.projectModal.close();
	}

	if (type === 'todo') {
		elements.todoForm.classList.remove('submitted');
		elements.todoForm.removeAttribute('data-todo-id');
		elements.todoModal.close();
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
	const isFormValid = checkValidInputs(elements.projectForm);
	if (!isFormValid) {
		elements.projectForm.classList.add('submitted');
		return;
	}
	const { type } = elements.projectModal.dataset;
	const projectFormData = {
		title: elements.projectFormTitleInput.value,
	};

	if (type === 'add') {
		addProject(projectFormData.title);
	}

	if (type === 'edit') {
		projectFormData.id = elements.projectForm.dataset.projectId;
		editProject(projectFormData);
	}

	closeModal('project');
	renderProjects();
};

const handleTodoFormSubmit = (e) => {
	e.preventDefault();
	const isFormValid = checkValidInputs(elements.todoForm);
	if (!isFormValid) {
		elements.todoForm.classList.add('submitted');
		return;
	}
	const { id } = elements.contentContainer.dataset;
	const { type } = elements.todoModal.dataset;
	const todoFormData = {
		title: elements.todoFormTitleInput.value,
		status: elements.todoFormStatusInput.value,
		date: elements.todoFormDateInput.value || null,
	};

	if (type === 'add') {
		addTodo(id, todoFormData);
	}

	if (type === 'edit') {
		todoFormData.id = elements.todoForm.dataset.todoId;
		editTodo(id, todoFormData);
	}

	closeModal('todo');
	renderTodos();
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
