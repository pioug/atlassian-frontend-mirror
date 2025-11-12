import memorizeOne from 'memoize-one';

export const isAnchorSupported = memorizeOne(() => {
	if (window.CSS && window.CSS.supports) {
		return window.CSS.supports('anchor-name: --anchor');
	}
	return false;
});
