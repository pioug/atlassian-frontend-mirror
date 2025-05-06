import { type ErrorData } from '../../common/utils/error';

export interface Options {
	operationName?: string;
	// Identifies whether we should throw an error and ignore the data if they returned alongside in the request
	//
	// Re-used the same kind of config as for Apollo Client Query components:
	// https://www.apollographql.com/docs/react/features/error-handling
	errorPolicy?: 'none' | 'all' | 'ignore';
}

export type InnerResponse<T> = {
	data: T;
	errors?: ErrorData[];
};

export type ResultResponse<Key extends string, Data> = { [name in Key]: Data };

export type Body<Variables> = {
	query: string;
	variables?: Variables;
};

export type GraphQLRequestDataResponse<Data> = Data | { response: Response };
