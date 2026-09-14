export function isAbortedRequestError(err: any): boolean {
	return (
		(err instanceof Error && err.message === 'request_cancelled') ||
		(!!err && err.name === 'AbortError')
	);
}
