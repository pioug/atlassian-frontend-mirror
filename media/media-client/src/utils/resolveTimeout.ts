export const resolveTimeout = <T>(timeout: number, resolveWith: T): Promise<T> =>
	new Promise((resolve, _reject) => {
		setTimeout(resolve, timeout, resolveWith);
	});
