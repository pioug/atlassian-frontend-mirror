import { type Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import {
	OPERATOR_CHANGED,
	OPERATOR_EQUALS,
	OPERATOR_GT,
	OPERATOR_GT_EQUALS,
	OPERATOR_IN,
	OPERATOR_IS,
	OPERATOR_IS_NOT,
	OPERATOR_LIKE,
	OPERATOR_LT,
	OPERATOR_LT_EQUALS,
	OPERATOR_NOT_EQUALS,
	OPERATOR_NOT_IN,
	OPERATOR_NOT_LIKE,
	OPERATOR_WAS,
	OPERATOR_WAS_IN,
	OPERATOR_WAS_NOT,
	OPERATOR_WAS_NOT_IN,
} from '@atlaskit/jql-ast';
import { type AutocompleteOptions } from '@atlaskit/jql-editor-common';

// Opinionated order in which we want to render operators
export const ORDERED_OPERATORS: string[] = [
	OPERATOR_EQUALS,
	OPERATOR_NOT_EQUALS,
	OPERATOR_LIKE,
	OPERATOR_NOT_LIKE,
	OPERATOR_LT_EQUALS,
	OPERATOR_GT_EQUALS,
	OPERATOR_GT,
	OPERATOR_LT,
	OPERATOR_IS,
	OPERATOR_IS_NOT,
	OPERATOR_IN,
	OPERATOR_NOT_IN,
	OPERATOR_WAS,
	OPERATOR_WAS_NOT,
	OPERATOR_WAS_IN,
	OPERATOR_WAS_NOT_IN,
	OPERATOR_CHANGED,
];

export const sortOperators = (operators$: Observable<AutocompleteOptions>) => {
	return operators$.pipe(
		map((options) => {
			return ORDERED_OPERATORS.reduce<AutocompleteOptions>((result, orderedOperator) => {
				const matchingOption = options.find(
					(option) => orderedOperator.toLowerCase() === option.value.toLowerCase(),
				);
				if (matchingOption !== undefined) {
					result.push(matchingOption);
				}
				return result;
			}, []);
		}),
	);
};
