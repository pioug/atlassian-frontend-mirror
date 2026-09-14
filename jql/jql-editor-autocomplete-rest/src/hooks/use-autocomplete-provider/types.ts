import type {
	AutocompleteOptions,
	AutocompleteProvider,
} from '@atlaskit/jql-editor-common/autocomplete/types';

export type OnFields = AutocompleteProvider['onFields'];
export type OnOperators = AutocompleteProvider['onOperators'];
export type OnFunctions = AutocompleteProvider['onFunctions'];
export type OnValues = AutocompleteProvider['onValues'];
export type OnFunctionArguments = NonNullable<AutocompleteProvider['onFunctionArguments']>;

/**
 * {@link OnValues} with an optional enclosing function name, used for analytics. The extra parameter
 * is optional so this remains assignable to `OnValues`.
 */
export type OnValuesWithFunctionName = (
	query?: string,
	field?: string,
	functionName?: string,
) => ReturnType<OnValues>;

export type FieldValuesCache = {
	[key: string]: AutocompleteOptions;
};

export type UpdateCacheAction = {
	payload: {
		cacheKey: string;
		values: AutocompleteOptions;
	};
	type: 'update-cache';
};
