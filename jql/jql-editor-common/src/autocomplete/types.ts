import { type Observable } from 'rxjs/Observable';

import { type JQLClause } from '@atlaskit/jql-autocomplete';

export type AutocompleteValueType = 'user';

export type AutocompleteOption = {
	/**
	 * Display name to be rendered for this option in autocomplete dropdown.
	 */
	name: string;
	/**
	 * JQL value to be used when inserting this option in the query.
	 */
	value: string;
	/**
	 * Whether the current option is deprecated or not.
	 */
	isDeprecated?: boolean;
	/**
	 * SearcherKey of the deprecated field.
	 */
	deprecatedSearcherKey?: string;
	/**
	 * Field type to be rendered alongside `name` for this option.
	 */
	fieldType?: string;
	/**
	 * Defines the type of rich inline node to be rendered when this option is inserted (or undefined if plain text).
	 */
	valueType?: AutocompleteValueType;
	/**
	 * Whether the provided function can be applied to list operators. If this is `true` the function *may also be
	 * applicable* for single value operators in the case of Forge/Connect JQL functions.
	 */
	isListFunction?: boolean;
	/**
	 * Display name to be rendered for this option inside of a rich inline node.
	 */
	nameOnRichInlineNode?: string;
};

export type AutocompleteOptions = AutocompleteOption[];

export type AutocompleteProvider = {
	onFields: (query?: string, clause?: JQLClause) => Observable<AutocompleteOptions>;
	onOperators: (query?: string, field?: string) => Observable<AutocompleteOptions>;
	onValues: (query?: string, field?: string) => Observable<AutocompleteOptions>;
	onFunctions: (
		query?: string,
		field?: string,
		isListOperator?: boolean,
	) => Observable<AutocompleteOptions>;
};
