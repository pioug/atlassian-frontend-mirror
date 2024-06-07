const convertToError = (e: unknown): Error => {
	let error: Error;

	if (e instanceof Error) {
		error = e;
	} else if (typeof e === 'string') {
		error = new Error(e);
	} else if (typeof e === 'object') {
		try {
			error = new Error('Object error instance thrown for operation: ' + JSON.stringify(e));
		} catch (jsonError) {
			error = new Error('Object serialisation error thrown during operation: ' + String(e));
		}
	} else {
		error = new Error('No error instance thrown for operation: ' + String(e));
	}

	return error;
};

export default convertToError;
