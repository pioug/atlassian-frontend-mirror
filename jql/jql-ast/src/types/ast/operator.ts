import {
	CHANGED_OPERATORS,
	COMPARISON_OPERATORS,
	EQUALS_OPERATORS,
	IN_OPERATORS,
	IS_OPERATORS,
	LIKE_OPERATORS,
	LIST_OPERATORS,
	OPERATORS,
	WAS_IN_OPERATORS,
	WAS_OPERATORS,
} from '../../constants';

import { type AstNode } from './common';

export type OperatorValue = (typeof OPERATORS)[number];
export type EqualsOperatorValue = (typeof EQUALS_OPERATORS)[number];
export type LikeOperatorValue = (typeof LIKE_OPERATORS)[number];
export type ComparisonOperatorValue = (typeof COMPARISON_OPERATORS)[number];
export type InOperatorValue = (typeof IN_OPERATORS)[number];
export type IsOperatorValue = (typeof IS_OPERATORS)[number];
export type WasOperatorValue = (typeof WAS_OPERATORS)[number];
export type WasInOperatorValue = (typeof WAS_IN_OPERATORS)[number];
export type ChangedOperatorValue = (typeof CHANGED_OPERATORS)[number];
export type ListOperatorValue = (typeof LIST_OPERATORS)[number];

export type Operator =
	| EqualsOperator
	| LikeOperator
	| ComparisonOperator
	| InOperator
	| IsOperator
	| WasOperator
	| WasInOperator
	| ChangedOperator;

export type EqualsOperator = BaseOperator<EqualsOperatorValue>;

export type LikeOperator = BaseOperator<LikeOperatorValue>;

export type ComparisonOperator = BaseOperator<ComparisonOperatorValue>;

export type InOperator = BaseOperator<InOperatorValue>;

export type IsOperator = BaseOperator<IsOperatorValue>;

export type WasOperator = BaseOperator<WasOperatorValue>;

export type WasInOperator = BaseOperator<WasInOperatorValue>;

export type ChangedOperator = BaseOperator<ChangedOperatorValue>;

export interface BaseOperator<T> extends AstNode {
	/**
	 * Literal value for an operator (with formatting preserved).
	 */
	text: string;
	/**
	 * Enum constant representation of the operator value.
	 */
	value: T;
}

// Guards

export const isOperator = (operator: string): operator is OperatorValue =>
	OPERATORS.includes(operator as OperatorValue);

export const isEqualsOperator = (operator: string): operator is EqualsOperatorValue =>
	EQUALS_OPERATORS.includes(operator as EqualsOperatorValue);

export const isLikeOperator = (operator: string): operator is LikeOperatorValue =>
	LIKE_OPERATORS.includes(operator as LikeOperatorValue);

export const isComparisonOperator = (operator: string): operator is ComparisonOperatorValue =>
	COMPARISON_OPERATORS.includes(operator as ComparisonOperatorValue);

export const isInOperator = (operator: string): operator is InOperatorValue =>
	IN_OPERATORS.includes(operator as InOperatorValue);

export const isIsOperator = (operator: string): operator is IsOperatorValue =>
	IS_OPERATORS.includes(operator as IsOperatorValue);

export const isWasOperator = (operator: string): operator is WasOperatorValue =>
	WAS_OPERATORS.includes(operator as WasOperatorValue);

export const isWasInOperator = (operator: string): operator is WasInOperatorValue =>
	WAS_IN_OPERATORS.includes(operator as WasInOperatorValue);

export const isChangedOperator = (operator: string): operator is ChangedOperatorValue =>
	CHANGED_OPERATORS.includes(operator as ChangedOperatorValue);

export const isListOperator = (operator: string): operator is ListOperatorValue =>
	LIST_OPERATORS.includes(operator as ListOperatorValue);
