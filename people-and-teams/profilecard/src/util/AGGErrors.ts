import { AGGError } from './AGGError';

export class AGGErrors extends Error {
	errors: AGGError[];
	traceId?: string | null;
	constructor(errors: unknown, traceId: string | null) {
		super('AGGErrors');
		this.traceId = traceId;

		if (Array.isArray(errors)) {
			this.errors = errors.map(
				(error) => new AGGError(error.message, error.extensions, error.path),
			);
		} else {
			this.errors = [];
		}
	}
}
