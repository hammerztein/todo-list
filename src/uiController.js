import {
	addProject,
	deleteProject,
	editProject,
	getAllProjects,
} from './logicController.js';

const elements = {
	openModalBtn: document.querySelector('#open-project-modal'),
	projectModal: document.querySelector('#project-modal'),
	projectForm: document.querySelector('.project-form'),
	projectFormTitleInput: document.querySelector('#project-title'),
	projectList: document.querySelector('.projects'),
	projectFormBtn: document.querySelector("button[type='submit']"),
};

const clearProjectsContainer = () => {
	const children = [...elements.projectList.childNodes];
	children.forEach((child) => {
		elements.projectList.removeChild(child);
	});
};

const createProjectElement = (project) => {
	const listEl = document.createElement('li');
	listEl.textContent = project.title;
	const editBtn = document.createElement('button');
	const delBtn = document.createElement('button');
	editBtn.textContent = 'Edit';
	editBtn.dataset.buttonType = 'edit';
	delBtn.textContent = 'Delete';
	editBtn.addEventListener('click', (e) => handleProjectEdit(e, project));
	delBtn.addEventListener('click', () => handleDeleteProject(project.id));
	listEl.appendChild(editBtn);
	listEl.appendChild(delBtn);
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
};

const setProjectEditFields = (project) => {
	elements.projectFormTitleInput.value = project.title;
	elements.projectForm.dataset.projectId = project.id;
};

const setProjectModalType = (e) => {
	const { buttonType } = e.currentTarget.dataset;
	elements.projectFormBtn.textContent = `${buttonType[0]
		.toUpperCase()
		.concat(buttonType.slice(1))} Project`;
	elements.projectModal.dataset.type = buttonType;
	elements.projectForm.reset();
};

const openEditModal = () => {
	elements.projectModal.showModal();
};

const handleProjectEdit = (e, project) => {
	setProjectModalType(e);
	openEditModal();
	setProjectEditFields(project);
};

const handleFormSubmit = (e) => {
	e.preventDefault();

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

	elements.projectModal.close();
	renderProjects();
};

const handleDeleteProject = (projectId) => {
	deleteProject(projectId);
	renderProjects();
};

const registerEventListeners = () => {
	elements.projectForm.addEventListener('submit', handleFormSubmit);
	elements.openModalBtn.addEventListener('click', setProjectModalType);
};

export { renderProjects, registerEventListeners };
