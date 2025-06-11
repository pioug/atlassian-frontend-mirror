export const getDocument = () => {
	if (typeof document !== 'undefined') {
		return document;
	}
	return null;
};
