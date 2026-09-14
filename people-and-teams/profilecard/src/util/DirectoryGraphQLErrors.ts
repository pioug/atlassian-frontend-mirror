import { DirectoryGraphQLError } from './DirectoryGraphQLError';

export class DirectoryGraphQLErrors extends Error {
	errors: DirectoryGraphQLError[];
	traceId?: string | null;
	constructor(errors: unknown, traceId: string | null) {
		super('DirectoryGraphQLErrors');
		this.traceId = traceId;

		if (Array.isArray(errors)) {
			this.errors = errors.map(
				(error) =>
					new DirectoryGraphQLError(
						error.message,
						error.category,
						error.type,
						error.extensions,
						error.path,
					),
			);
		} else {
			this.errors = [];
		}
	}
}
