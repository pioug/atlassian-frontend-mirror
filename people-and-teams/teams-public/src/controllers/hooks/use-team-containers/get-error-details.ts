import { normalizeError } from './normalize-error';

export function getErrorDetails(err: unknown): { message: string; stack?: string } {
	const error = normalizeError(err);
	return {
		message: error.message,
		stack: error.stack,
	};
}
