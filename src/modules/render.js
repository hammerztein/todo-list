import { createElement, appendChildern } from './../utils/dom.js';
import { formatDate } from './../utils/date.js';
import editIcon from './../assets/edit.svg';
import deleteIcon from './../assets/delete.svg';
import calendar from './../assets/calendar.svg';

const clearContainer = (parent) => {
	const children = [...parent.childNodes];
	children.forEach((child) => {
		parent.removeChild(child);
	});
};

const createTodoElement = (todo) => {
	const listEl = createElement('li', {
		className: 'todo',
		dataset: { id: todo.id },
	});
	const divLeft = createElement('div', { className: 'left' });
	const divRight = createElement('div', { className: 'right' });
	const todoTitle = createElement('h4', { textContent: todo.title });
	const dateEl = createElement('p', {
		className: 'todo-date',
		innerHTML: calendar,
	});
	const formattedDate = formatDate(todo.date);
	const dateText = document.createTextNode(formattedDate);
	dateEl.appendChild(dateText);
	const editBtn = createElement('button', {
		className: 'action-btn',
		innerHTML: editIcon,
		dataset: {
			action: 'edit',
		},
	});
	const delBtn = createElement('button', {
		className: 'action-btn',
		innerHTML: deleteIcon,
		dataset: {
			action: 'delete',
		},
	});

	appendChildern(divLeft, [todoTitle, dateEl]);
	appendChildern(divRight, [editBtn, delBtn]);
	appendChildern(listEl, [divLeft, divRight]);
	return listEl;
};

const createTodoList = (todos, { doneList, notDoneList }) => {
	todos.forEach((todo) => {
		const todoListEntry = createTodoElement(todo);

		if (todo.status === 'true') {
			doneList.appendChild(todoListEntry);
		} else {
			notDoneList.appendChild(todoListEntry);
		}
	});
};

const renderTodos = (todos, { doneList, notDoneList }) => {
	clearContainer(doneList);
	clearContainer(notDoneList);

	if (todos.length !== 0) {
		createTodoList(todos, { doneList, notDoneList });
	}
};

const createProjectElement = (project, activeProjectId) => {
	const listEl = createElement('li', { dataset: { id: project.id } });
	if (project.id === activeProjectId) {
		listEl.classList.add('selected');
	}
	const projectTitle = createElement('span', { textContent: project.title });
	const btnContainer = createElement('div', { className: 'controls' });
	const editBtn = createElement('button', {
		className: 'action-btn',
		innerHTML: editIcon,
		dataset: {
			action: 'edit',
		},
	});
	const delBtn = createElement('button', {
		className: 'action-btn',
		innerHTML: deleteIcon,
		dataset: {
			action: 'delete',
		},
	});
	appendChildern(btnContainer, [editBtn, delBtn]);
	appendChildern(listEl, [projectTitle, btnContainer]);
	return listEl;
};

const createProjectList = (projects, container, activeProjectId) => {
	projects.forEach((project) => {
		const projectListEntry = createProjectElement(project, activeProjectId);
		container.appendChild(projectListEntry);
	});
};

const renderProjects = (projects, container, activeProjectId) => {
	clearContainer(container);
	createProjectList(projects, container, activeProjectId);
};

export { renderProjects, renderTodos };

