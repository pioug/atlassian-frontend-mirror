import type { ActualGraphQLError } from './ActualGraphQLError';
import type { UseQueryLightErrorExtensions } from './UseQueryLightErrorExtensions';

export class UseQueryLightError extends Error {
	networkError?: Error | null;
	graphQLErrors?: ActualGraphQLError[];
	extensions?: UseQueryLightErrorExtensions;
	extraInfo?: any;

	constructor(
		message: string,
		name?: string,
		graphQLErrors?: ActualGraphQLError[],
		networkError?: Error,
		extensions?: UseQueryLightErrorExtensions,
		extraInfo?: any,
	) {
		super(message);
		this.graphQLErrors = graphQLErrors;
		this.networkError = networkError;
		this.extensions = extensions;
		this.extraInfo = extraInfo;
		if (name) {
			this.name = name;
		}
	}
}
