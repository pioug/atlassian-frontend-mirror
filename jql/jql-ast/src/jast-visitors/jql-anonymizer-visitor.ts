import {
	CLAUSE_TYPE_COMPOUND,
	COLLAPSED_CUSTOM_FIELD_PATTERN,
	ORDER_BY_OPERATOR_ORDER_BY,
	PRIVACY_SAFE_FIELDS,
} from '../constants';
import {
	type Clause,
	type CompoundClause,
	type Field,
	type FunctionOperand,
	type KeywordOperand,
	type ListOperand,
	type NotClause,
	type OrderBy,
	type Predicate,
	type Query,
	type TerminalClause,
} from '../types';
import { notUndefined } from '../utils';

import { AbstractJastVisitor } from './abstract-jast-visitor';

const ANONYMIZED_FIELD = '"?"';
const ANONYMIZED_VALUE = '"?"';
const CUSTOM_FIELD_PATTERN = /^cf\[\d+]$/i;

const privacySafeFields = new Set(PRIVACY_SAFE_FIELDS);

const getPrivacySafeFieldName = (field: Field) => {
	// Privacy safe field name (Jira field)
	if (privacySafeFields.has(field.value.toLowerCase())) {
		return field.text;
	}

	// Custom field identifier, e.g. cf[10001]
	if (CUSTOM_FIELD_PATTERN.test(field.value)) {
		return field.text;
	}

	// Collapsed custom field
	const match = field.text.match(COLLAPSED_CUSTOM_FIELD_PATTERN);
	if (match) {
		return `"?[${match[1]}]"`;
	}

	// Other field names that can potentially contain UGC
	return ANONYMIZED_FIELD;
};

export class JqlAnonymizerVisitor extends AbstractJastVisitor<string> {
	visitQuery = (query: Query): string => {
		const where: string | undefined = query.where ? query.where.accept(this) : undefined;
		const orderBy: string | undefined = query.orderBy ? query.orderBy.accept(this) : undefined;
		return [where, orderBy].filter(notUndefined).join(' ');
	};

	visitField = (field: Field): string => {
		const name = getPrivacySafeFieldName(field);

		if (field.properties && field.properties.length) {
			const properties = field.properties
				.map((property) => {
					const key = property.key ? property.key.text : '';
					const path = property.path ? property.path.map((arg) => arg.text).join('') : '';
					return `[${key}]${path}`;
				})
				.join('');
			return `${name}${properties}`;
		}

		return name;
	};

	visitTerminalClause = (terminalClause: TerminalClause): string => {
		const field = terminalClause.field.accept(this);
		const operator = terminalClause.operator ? terminalClause.operator.text : undefined;
		const operand = terminalClause.operand ? terminalClause.operand.accept(this) : undefined;
		const predicates = terminalClause.predicates.map((predicate) => predicate.accept(this));
		return [field, operator, operand, ...predicates].filter(notUndefined).join(' ');
	};

	visitCompoundClause = (compoundClause: CompoundClause): string => {
		const operator = compoundClause.operator.value;
		return compoundClause.clauses
			.map((clause: Clause) => {
				// Nested compound clauses should be wrapped in parentheses
				return clause.clauseType === CLAUSE_TYPE_COMPOUND
					? `(${clause.accept(this)})`
					: clause.accept(this);
			})
			.join(` ${operator} `);
	};

	visitNotClause = (notClause: NotClause): string => {
		// Nested compound clauses should be wrapped in parentheses
		const nestedClause =
			notClause.clause.clauseType === CLAUSE_TYPE_COMPOUND
				? `(${notClause.clause.accept(this)})`
				: notClause.clause.accept(this);
		return `${notClause.operator.value} ${nestedClause}`;
	};

	visitValueOperand = (): string => {
		return ANONYMIZED_VALUE;
	};

	visitListOperand = (listOperand: ListOperand): string => {
		return `(${listOperand.values.map((value) => value.accept(this)).join(', ')})`;
	};

	visitFunctionOperand = (functionOperand: FunctionOperand): string => {
		const functionName = functionOperand.function.text;
		const functionArguments = functionOperand.arguments.map(() => ANONYMIZED_VALUE).join(', ');
		return `${functionName}(${functionArguments})`;
	};

	visitKeywordOperand = (keywordOperand: KeywordOperand): string => {
		return keywordOperand.value;
	};

	visitPredicate = (predicate: Predicate): string => {
		const operator = predicate.operator.text;
		const operand = predicate.operand ? predicate.operand.accept(this) : undefined;
		return [operator, operand].filter(notUndefined).join(' ');
	};

	visitOrderBy = (orderBy: OrderBy): string => {
		const orderByFields = orderBy.fields.map((orderByField) => {
			const field = orderByField.field.accept(this);
			const direction = orderByField.direction ? orderByField.direction.value : undefined;
			return [field, direction].filter(notUndefined).join(' ');
		});
		return `${ORDER_BY_OPERATOR_ORDER_BY} ${orderByFields.join(', ')}`;
	};

	protected defaultResult(): string {
		return '';
	}
}
