const applicationState = {
	activeProjectId: null,
	activeTodoId: null,
	modalType: null,
};

export const getActiveProjectId = () => {
	return applicationState.activeProjectId;
};

export const getActiveTodoId = () => {
	return applicationState.activeTodoId;
};

export const getModalType = () => {
	return applicationState.modalType;
};

export const setActiveProjectId = (projectId) => {
	applicationState.activeProjectId = projectId;
};

export const setActiveTodoId = (todoId) => {
	applicationState.activeTodoId = todoId;
};

export const setModalType = (modalType) => {
	applicationState.modalType = modalType;
};

