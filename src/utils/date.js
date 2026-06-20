export const formatDate = (dateString) => {
	if (!dateString) return 'No Date';
	const date = new Date(dateString);
	return Intl.DateTimeFormat('en-GB', {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
	}).format(date);
};

