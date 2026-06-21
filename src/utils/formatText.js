export const capitalizeWord = (word) => {
	return word
		.split('')
		.map((letter, index) => {
			if (index === 0) {
				return letter.toUpperCase();
			}
			return letter;
		})
		.join('');
};

