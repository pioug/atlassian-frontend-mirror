export const rejectAfter = <T>(fn: () => Promise<T>, delay = 5000): Promise<T> => {
	return new Promise<T>(async (resolve, reject) => {
		const timeoutId = setTimeout(() => reject(new Error('timed out')), delay);

		try {
			resolve(await fn());
		} catch (error) {
			reject(error);
		} finally {
			clearTimeout(timeoutId);
		}
	});
};
