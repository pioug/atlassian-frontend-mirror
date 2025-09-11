export default (): Navigator | undefined => {
	if (typeof window === 'undefined') {
		return;
	}
	if (typeof window.navigator === 'undefined') {
		return;
	}
	return window.navigator;
};
