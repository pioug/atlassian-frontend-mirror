const ignoredErrors = ['SLOIgnoreError', 'SLOIgnoreHttpError'];

export const isIgnoredError = (error: Error): boolean => {
	const errorName = error?.constructor.name;
	if (!errorName) {
		return false;
	}

	return ignoredErrors.includes(errorName);
};
