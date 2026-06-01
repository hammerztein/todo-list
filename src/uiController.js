import { addProject, getAllProjects } from './logicController.js';

const elements = {
	projetModal: document.querySelector('#project-modal'),
	projectForm: document.querySelector('.project-form'),
	projectFormTitleInput: document.querySelector('#project-title'),
	projectList: document.querySelector('.projects'),
};

const clearProjectsContainer = () => {
	const children = [...elements.projectList.childNodes];
	children.forEach((child) => {
		elements.projectList.removeChild(child);
	});
};

const renderProjects = () => {
	const projects = getAllProjects();
	clearProjectsContainer();
	projects.forEach((project) => {
		const listEl = document.createElement('li');
		listEl.textContent = `${project.id.slice(0, 5)}... / ${project.title}`;
		elements.projectList.appendChild(listEl);
	});
};

const handleAddProject = (e) => {
	e.preventDefault();
	const formData = {
		id: crypto.randomUUID(),
		title: elements.projectFormTitleInput.value,
	};
	addProject(formData);
	renderProjects();
	elements.projectForm.reset();
	elements.projetModal.close();
};

const registerEventListeners = () => {
	elements.projectForm.addEventListener('submit', handleAddProject);
};

export { renderProjects, registerEventListeners };

