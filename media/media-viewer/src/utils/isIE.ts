export const isIE = (navigator: Navigator = window.navigator): boolean => {
	return navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0;
};
