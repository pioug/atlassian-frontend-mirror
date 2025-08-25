import {
	NODE_TYPE_OPERAND,
	type OPERAND_EMPTY,
	type OPERAND_TYPE_FUNCTION,
	type OPERAND_TYPE_KEYWORD,
	type OPERAND_TYPE_LIST,
	type OPERAND_TYPE_VALUE,
} from '../../constants';

import { type Argument } from './argument';
import { type AstNode } from './common';

export type KeywordOperandValue = typeof OPERAND_EMPTY;

/**
 * An operand that is a user-provided value.
 */
export interface ValueOperand extends AstNode {
	operandType: typeof OPERAND_TYPE_VALUE;
	/**
	 * Literal operand value (with quotes and escaping preserved).
	 */
	text: string;
	type: typeof NODE_TYPE_OPERAND;
	/**
	 * Semantic operand value (without quotes or escaping derived from those quotes).
	 */
	value: string;
}

/**
 * An operand that is a JQL keyword.
 * See <a href="https://confluence.atlassian.com/jiracorecloud/advanced-searching-keywords-reference-765593717.html#Advancedsearching-keywordsreference-EMPTYEMPTY">Advanced searching - keywords reference</a>
 * for more information about operand keywords.
 */
export interface KeywordOperand extends AstNode {
	operandType: typeof OPERAND_TYPE_KEYWORD;
	type: typeof NODE_TYPE_OPERAND;
	/**
	 * The keyword that is the operand value.
	 */
	value: KeywordOperandValue;
}

/**
 * An operand that is a function.
 * See <a href="https://confluence.atlassian.com/x/dwiiLQ">Advanced searching - functions reference</a> for more
 * information about JQL functions.
 */
export interface FunctionOperand extends AstNode {
	/**
	 * The list of function arguments.
	 */
	arguments: Argument[];
	/**
	 * The name of the function.
	 */
	function: FunctionString;
	operandType: typeof OPERAND_TYPE_FUNCTION;
	type: typeof NODE_TYPE_OPERAND;
}

/**
 * A function name used in an operand.
 */
export interface FunctionString extends AstNode {
	/**
	 * Literal name of the function (with quotes and escaping preserved).
	 */
	text: string;
	/**
	 * Semantic name of the function (without quotes or escaping derived from those quotes).
	 */
	value: string;
}

/**
 * An operand that is a list of values.
 */
export interface ListOperand extends AstNode {
	/**
	 * Function to append operand to existing list of operand
	 */
	appendOperand: (this: ListOperand, operand: Operand) => void;
	operandType: typeof OPERAND_TYPE_LIST;
	type: typeof NODE_TYPE_OPERAND;

	/**
	 * The list of operand values.
	 */
	values: Operand[];
}

//
// ---- Operand Union
//

export type OperandType =
	| typeof OPERAND_TYPE_VALUE
	| typeof OPERAND_TYPE_FUNCTION
	| typeof OPERAND_TYPE_KEYWORD
	| typeof OPERAND_TYPE_LIST;

/**
 * Represents the right hand side value of a clause.
 */
export type Operand = ListOperand | ValueOperand | KeywordOperand | FunctionOperand;

export const isOperandNode = (maybeOperandNode: AstNode): maybeOperandNode is Operand =>
	(maybeOperandNode as Operand).type === NODE_TYPE_OPERAND;
