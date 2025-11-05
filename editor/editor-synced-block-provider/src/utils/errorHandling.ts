export const stringifyError = (error: unknown) => {
	try {
		return JSON.stringify(error);
	} catch {
		return undefined;
	}
};
