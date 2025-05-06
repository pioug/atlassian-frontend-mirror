import { type GraphQLError } from 'graphql';

export interface QueryOptions<TParams> {
	serviceUrl: string;
	variables?: TParams;
	operationName: string;
	skip?: boolean;
	customHeaders?: Record<string, string>;
}

export enum ErrorCategory {
	NotFound = 'NotFound',
	NotPermitted = 'NotPermitted',
	MalformedInput = 'MalformedInput',
	Internal = 'Internal',
}

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

export interface QueryStatus<TResult> {
	loading: boolean;
	data?: TResult;
	error?: UseQueryLightError;
}

type UseQueryLightErrorExtensions = {
	classification?: string;
	statusCode?: number;
};
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

export interface QueryResponse<TParams, TResult> extends QueryStatus<TResult> {
	loading: boolean;
	data?: TResult;
	error?: UseQueryLightError;
	refetch: () => void;
	fetchMore: (args: FetchMoreArgs<TParams, TResult>) => void;
}

export interface QueryResult<TResult> {
	data?: TResult;
	extensions: {
		errorNumber: number;
	};
	errors?: GraphQLError[];
}

export interface FetchMoreArgs<TParams, TResult> {
	variables: Partial<TParams>;
	handleDataMerge: (
		prevData: TResult | undefined,
		newData: TResult | undefined,
	) => TResult | undefined;
}
