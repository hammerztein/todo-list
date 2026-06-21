export const createElement = (tag, options = {}) => {
	const element = document.createElement(tag);

	if (options.className) {
		element.className = options.className;
	}

	if (options.textContent) {
		element.textContent = options.textContent;
	}

	if (options.innerHTML) {
		element.innerHTML = options.innerHTML;
	}

	if (options.dataset) {
		for (const key in options.dataset) {
			element.dataset[key] = options.dataset[key];
		}
	}

	return element;
};

export const appendChildern = (parent, children) => {
	[...children].forEach((child) => parent.appendChild(child));
};

