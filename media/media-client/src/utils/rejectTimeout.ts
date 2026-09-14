export const rejectTimeout = (timeout: number, rejectWith: Error): Promise<undefined> =>
	new Promise((_resolve, reject) => {
		setTimeout(reject, timeout, rejectWith);
	});
