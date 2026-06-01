import './styles.css';
import { registerEventListeners, renderProjects } from './uiController.js';

(() => {
	registerEventListeners();
	renderProjects();
})();

