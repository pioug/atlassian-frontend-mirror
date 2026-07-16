export const getDocument = (): Document | null => {
	if (typeof document !== 'undefined') {
		return document;
	}
	return null;
};
