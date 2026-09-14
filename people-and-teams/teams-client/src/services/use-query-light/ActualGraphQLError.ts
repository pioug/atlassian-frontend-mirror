import type { ErrorCategory } from './types';
import type { UseQueryLightErrorExtensions } from './UseQueryLightErrorExtensions';

export class ActualGraphQLError extends Error {
	// AGG standard
	extensions?: UseQueryLightErrorExtensions;
	message: string;
	path: readonly (string | number)[] | undefined;
	category?: ErrorCategory;
	type?: string;

	constructor(message: string) {
		super(message);
		this.message = message;
	}
}
