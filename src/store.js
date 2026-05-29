const loadFromStorage = () => {
	const data = localStorage.getItem('projects') || [];
	return JSON.parse(data);
};

const saveToStorage = (projects) => {
	const data = JSON.stringify(projects);
	localStorage.setItem('projects', data);
};

export { loadFromStorage, saveToStorage };
