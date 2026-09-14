export const callCallback = <U extends any[], R>(
	callback: ((...U: U) => R) | undefined,
	...args: U
): R | undefined => {
	if (typeof callback === 'function') {
		try {
			//  there is mystery error in IE 11, so we need this try-catch
			return callback(...args);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('@atlassian/user-select: an error happening in `callCallback`: ', error);
		}
	}

	return undefined;
};
