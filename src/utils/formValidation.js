export const checkValidInputs = (formElement) => {
	const inputs = [...formElement.elements];
	const requiredInputs = inputs.filter((input) => input.required);

	return !requiredInputs.some((input) => input.value === ' ');
};

