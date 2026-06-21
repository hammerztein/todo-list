const applicationState = {
	activeProjectId: null,
	editProjectId: null,
	editTodoId: null,
	modalType: null,
	modalAction: null,
};

export const getActiveProjectId = () => {
	return applicationState.activeProjectId;
};

export const getEditProjectId = () => {
	return applicationState.editProjectId;
};

export const getEditTodoId = () => {
	return applicationState.editTodoId;
};

export const getModalType = () => {
	return applicationState.modalType;
};

export const getModalAction = () => {
	return applicationState.modalAction;
};

export const setActiveProjectId = (projectId) => {
	applicationState.activeProjectId = projectId;
};

export const setEditProjectId = (projectId) => {
	applicationState.editProjectId = projectId;
};

export const setEditTodoId = (todoId) => {
	applicationState.editTodoId = todoId;
};

export const setModalType = (modalType) => {
	applicationState.modalType = modalType;
};
export const setModalAction = (modalAction) => {
	applicationState.modalAction = modalAction;
};

