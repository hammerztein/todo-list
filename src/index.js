import './styles.css';
import {
	refreshProjects,
	registerEventListeners,
} from './modules/uiController.js';

(() => {
	registerEventListeners();
	refreshProjects();
})();
