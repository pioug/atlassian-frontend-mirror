import mergeWith from 'lodash/mergeWith';

import {
	AbstractJastVisitor,
	COMPOUND_OPERATOR_AND,
	COMPOUND_OPERATOR_OR,
	type CompoundClause,
	JastBuilder,
	OPERATOR_EQUALS,
	OPERATOR_IN,
	OPERATOR_LIKE,
	type OrderByField,
	type TerminalClause,
} from '@atlaskit/jql-ast';
import { fg } from '@atlaskit/platform-feature-flags';

import { ALLOWED_ORDER_BY_KEYS } from '../../jira-search-container';

import { isClauseTooComplex } from './isClauseTooComplex';

import { isValidJql } from './index';

// Map of field keys to their respective clauses in the Jast
type ClauseMap = {
	[x: string]: (TerminalClause | CompoundClause)[];
};

const allowedFields: string[] = [
	// basic filter fields
	'assignee',
	'type',
	'project',
	'status',

	// search input fields
	'text',
	'summary',
	'key',
];

const fallbackOperators = [OPERATOR_IN];

const fieldSpecificOperators: Record<string, string[]> = {
	text: [OPERATOR_LIKE, OPERATOR_EQUALS],
	summary: [OPERATOR_LIKE, OPERATOR_EQUALS],
	key: [OPERATOR_EQUALS],
	project: [OPERATOR_IN, OPERATOR_EQUALS],
	type: [OPERATOR_IN, OPERATOR_EQUALS],
	status: [OPERATOR_IN, OPERATOR_EQUALS],
	assignee: [OPERATOR_IN, OPERATOR_EQUALS],
};

class JqlClauseCollectingVisitorError extends Error {}

/**
 * Rather than having to navigate the entire tree structure ourself, we extend AbstractJastVisitor
 * class and implement visitor functions for node types that we wish to process.
 * A list of available visitor can be viewed in packages/jql/jql-ast/src/types/api/jast-visitor.ts
 * more info - https://atlaskit.atlassian.com/packages/jql/jql-ast/docs/traversing-the-ast
 * */
class JqlClauseCollectingVisitor extends AbstractJastVisitor<ClauseMap> {
	constructor() {
		super();
	}

	visitNotClause = () => {
		throw new JqlClauseCollectingVisitorError(
			'Visited an unsupported node while traversing the AST',
		);
	};

	visitOrderByField = (orderByField: OrderByField): ClauseMap => {
		const fieldValue = orderByField.field.value?.toLowerCase();

		if (fieldValue && !ALLOWED_ORDER_BY_KEYS.includes(fieldValue)) {
			throw new JqlClauseCollectingVisitorError(
				`query with order by field '${fieldValue}' is not supported`,
			);
		}

		return {};
	};

	visitCompoundClause = (compoundClause: CompoundClause): ClauseMap => {
		const clauseMap: Record<string, any> = {};
		const operator = compoundClause.operator.value;

		if (operator === COMPOUND_OPERATOR_AND) {
			return compoundClause.clauses.reduce(
				(result, clause) => this.aggregateResult(clause.accept(this), result),
				clauseMap,
			);
		}

		if (operator === COMPOUND_OPERATOR_OR) {
			// this is delt with in isClauseTooComplex
			return this.aggregateResult({ text: [compoundClause] }, clauseMap);
		}

		throw new JqlClauseCollectingVisitorError(
			`Compound clauses using the operator '${operator}' is not supported`,
		);
	};

	visitTerminalClause = (terminalClause: TerminalClause): ClauseMap => {
		const fieldName = terminalClause.field.value.toLowerCase();

		if (!allowedFields.includes(fieldName)) {
			throw new JqlClauseCollectingVisitorError(
				`Field with name '${fieldName}' of type ${terminalClause.clauseType} is not supported`,
			);
		}

		const operator = terminalClause.operator?.value;
		const allowedOperators = fieldSpecificOperators[fieldName] || fallbackOperators;

		if (operator && !allowedOperators.includes(operator.toLowerCase())) {
			throw new JqlClauseCollectingVisitorError(
				`Field with name '${fieldName}' using operator ${operator} is not supported`,
			);
		}

		return { [terminalClause.field.value.toLowerCase()]: [terminalClause] };
	};

	protected aggregateResult(aggregate: ClauseMap, nextResult: ClauseMap): ClauseMap {
		return mergeWith(aggregate, nextResult, (destValue, srcValue) =>
			srcValue.concat(destValue ?? []),
		);
	}

	protected defaultResult(): ClauseMap {
		return {};
	}
}

export const isQueryTooComplex = (jql: string) => {
	if (!fg('platform.linking-platform.datasource.show-jlol-basic-filters') || !jql) {
		return false;
	}

	if (!isValidJql(jql)) {
		return true;
	}

	const jast = new JastBuilder().build(jql);

	try {
		const jqlClauseCollectingVisitor = new JqlClauseCollectingVisitor();

		const clauseMap: ClauseMap = jast.query ? jast.query.accept(jqlClauseCollectingVisitor) : {}; // jast.query is defined as void | Query, hence the fallback

		const hasAnyKeyWithComplexClause = Object.entries(clauseMap).some(([key, clauses]) =>
			isClauseTooComplex(clauses, key),
		);

		return hasAnyKeyWithComplexClause;
	} catch (error: any) {
		return true;
	}
};
