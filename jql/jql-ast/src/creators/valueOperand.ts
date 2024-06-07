import { NODE_TYPE_OPERAND, OPERAND_TYPE_VALUE } from '../constants';
import { type JastListener, type JastVisitor, type Position, type ValueOperand } from '../types';
import { normaliseJqlString, sanitiseJqlString } from '../utils';

import { noChildren } from './common';

function acceptValueOperand<Result>(this: ValueOperand, visitor: JastVisitor<Result>) {
	return visitor.visitValueOperand ? visitor.visitValueOperand(this) : visitor.visitChildren(this);
}

function enterNode(this: ValueOperand, listener: JastListener): void {
	listener.enterValueOperand && listener.enterValueOperand(this);
}

function exitNode(this: ValueOperand, listener: JastListener): void {
	listener.exitValueOperand && listener.exitValueOperand(this);
}

/**
 * Creates a ValueOperand AST node from a raw value that hasn't been pre-treated for use in a JQL string (for example,
 * if it can contain reserved characters or whitespaces without being wrapped in quotes).
 *
 * The provided value will be sanitised (quoted and escaped) if necessary before being set to the node's text property.
 *
 * @link valueOperandByText can be used instead if you are looking to create a ValueOperand node from a text that has
 * already been quoted/escaped, e.g. in situations where your data provider returns terms that are guaranteed to be valid JQL.
 *
 * @param value String to be set as the AST node's value. This value will typically come from some type of user input
 * which may require quoting/escaping to produce a valid JQL string.
 */
export const valueOperand = (value: string): ValueOperand =>
	valueOperandInternal(value, sanitiseJqlString(value));

/**
 * Creates a ValueOperand AST node from a value that has been pre-treated to produce a valid JQL string.
 *
 * @link valueOperand can be used instead if you are looking to create a ValueOperand node from a text that can potentially
 * contain invalid JQL, e.g. from a user input which may require quoting/escaping due to special characters or whitespaces.
 *
 * @param text String to be set as the AST node's text. This text should be valid JQL as it will be preserved as-is
 * when building the AST node.
 */
export const valueOperandByText = (text: string): ValueOperand =>
	valueOperandInternal(normaliseJqlString(text), text);

export const valueOperandInternal = (
	value: string,
	text: string,
	position: Position | null = null,
): ValueOperand => ({
	type: NODE_TYPE_OPERAND,
	operandType: OPERAND_TYPE_VALUE,
	text,
	value,
	position,
	accept: acceptValueOperand,
	enterNode,
	exitNode,
	getChildren: noChildren,
	parent: null,
});
