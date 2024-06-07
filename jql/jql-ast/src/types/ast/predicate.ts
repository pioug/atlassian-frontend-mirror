import { PREDICATE_OPERATORS } from '../../constants';

import { type AstNode } from './common';
import { type Operand } from './operand';

export type PredicateOperatorValue = (typeof PREDICATE_OPERATORS)[number];

/**
 * A time predicate for a temporal JQL clause.
 */
export interface Predicate extends AstNode {
	/**
	 * The operator between the field and the operand.
	 */
	operator: PredicateOperator;
	/**
	 * The operand applied to the operator.
	 */
	operand: Operand | void;
}

/**
 * The operator used in a time predicate.
 */
export interface PredicateOperator extends AstNode {
	/**
	 * Literal value for a predicate (with formatting preserved).
	 */
	text: string;
	/**
	 * Enum constant representation of the predicate value.
	 */
	value: PredicateOperatorValue;
}

// Guards

export const isPredicateOperator = (operator: string): operator is PredicateOperatorValue =>
	PREDICATE_OPERATORS.includes(operator as PredicateOperatorValue);
