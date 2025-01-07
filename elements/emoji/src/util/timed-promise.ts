export function promiseWithTimeout<T>(
	promise: Promise<T>,
	timeout: number,
	errorMessage = 'Timed out',
): Promise<T> {
	// Create a promise that rejects after the specified timeout
	const timeoutPromise = new Promise<T>((_, reject) =>
		setTimeout(() => reject(new Error(errorMessage)), timeout),
	);
	// Use Promise.race to race the provided promise against the timeout promise
	return Promise.race([promise, timeoutPromise]);
}
