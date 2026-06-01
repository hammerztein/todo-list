import { saveToStorage, loadFromStorage } from './store.js';
import Project from './classes/Projects.js';

export const addProject = (formData) => {
	const { id, title } = formData;
	const projects = loadFromStorage();
	const newProject = new Project(id, title);

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

