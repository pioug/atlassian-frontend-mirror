export const getPixelRatio = (): number => {
	if (typeof window === 'undefined') {
		return 0;
	}
	return window.devicePixelRatio;
};
