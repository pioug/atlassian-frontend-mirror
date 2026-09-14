export function normalizeError(err: unknown): Error {
	if (err instanceof Error) {
		return err;
	}
	return new Error(typeof err === 'string' ? err : JSON.stringify(err));
}
