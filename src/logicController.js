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

