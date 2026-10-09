import type { OperatorValue } from '@atlaskit/jql-ast/ast/operator';
import { COMPOUND_OPERATOR_AND, COMPOUND_OPERATOR_OR } from '@atlaskit/jql-ast/compound';
import creators from '@atlaskit/jql-ast/creators';
import { JastBuilder } from '@atlaskit/jql-ast/jast-builder';
import { OPERATOR_EQUALS, OPERATOR_IN, OPERATOR_LIKE } from '@atlaskit/jql-ast/operator';
import { ORDER_BY_DIRECTION_ASC, ORDER_BY_DIRECTION_DESC } from '@atlaskit/jql-ast/order-by';
import { print } from '@atlaskit/jql-ast/printers';
import type { Jast } from '@atlaskit/jql-ast/query';

import { type BasicFilterFieldType, type SelectedOptionsMap } from '../basic-filters/types';
import { availableBasicFilterTypes } from '../basic-filters/ui';

type BuildJQLInput = {
	filterValues?: SelectedOptionsMap;
	orderDirection?: string;
	orderKey?: string;
	rawSearch: string;
};

const fuzzySearchRegExp = /^"(.+)"$/;
const jiraIssueKeyRegExp = /[A-Z]+-\d+/;
export const fuzzyCharacter = '*';

const constructTerminalClause = (field: string, operator: OperatorValue, value: string) =>
	creators.terminalClause(
		creators.field(field),
		creators.operator(operator),
		creators.valueOperand(value),
	);

export const buildJQL = (input: BuildJQLInput): string => {
	/**
	 * Jql ast - Transforming the ast
	 * https://atlaskit.atlassian.com/packages/jql/jql-ast/docs/transforming-the-ast
	 */
	const jast: Jast = new JastBuilder().build('');

	const { query } = jast;
	const {
		rawSearch,
		orderDirection = ORDER_BY_DIRECTION_DESC,
		orderKey = 'created',
		filterValues,
	} = input;

	const trimmedRawSearch = rawSearch.trim();
	const hasValidFilterSelectionAndValues =
		filterValues &&
		// checks if filterValues have only valid keys
		Object.entries(filterValues).every(([key]) =>
			availableBasicFilterTypes.includes(key as BasicFilterFieldType),
		) &&
		// checks if atleast one fitler value has some selection object
		Object.values(filterValues).some((value) => value.length > 0);

	if (!query) {
		return '';
	}

	if (trimmedRawSearch) {
		const fuzzy = !trimmedRawSearch.match(fuzzySearchRegExp) ? fuzzyCharacter : '';
		const basicSearch = trimmedRawSearch.replace(/['"?*]+/g, '');

		const text = constructTerminalClause('text', OPERATOR_LIKE, `${basicSearch}${fuzzy}`);
		const summary = constructTerminalClause('summary', OPERATOR_LIKE, `${basicSearch}${fuzzy}`);

		const orClauseFields = [text, summary];

		if (jiraIssueKeyRegExp.test(trimmedRawSearch.toUpperCase())) {
			const key = constructTerminalClause('key', OPERATOR_EQUALS, basicSearch);
			orClauseFields.push(key);
		}

		const orClause = creators.compoundClause(
			creators.compoundOperator(COMPOUND_OPERATOR_OR),
			orClauseFields,
		);

		query.appendClause(orClause, COMPOUND_OPERATOR_AND);
	}

	if (hasValidFilterSelectionAndValues) {
		Object.entries(filterValues).forEach(([key, filterFieldValues]) => {
			if (filterFieldValues.length === 0) {
				return;
			}

			const filterInClause = creators.terminalClause(
				creators.field(key),
				creators.operator(OPERATOR_IN),
				creators.listOperand(
					filterFieldValues.map((filterFieldValue) =>
						creators.valueOperand(filterFieldValue.value),
					),
				),
			);

			query.appendClause(filterInClause, COMPOUND_OPERATOR_AND);
		});
	}

	const orderField = creators.orderByField(creators.field(orderKey));
	query.prependOrderField(orderField);
	query.setOrderDirection(
		creators.orderByDirection(
			orderDirection.toLowerCase() === 'asc' ? ORDER_BY_DIRECTION_ASC : ORDER_BY_DIRECTION_DESC,
		),
	);

	return print(jast, {
		printWidth: null, // this ensures jql string is not broken to new line
	});
};
