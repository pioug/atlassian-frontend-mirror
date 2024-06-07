import { NODE_TYPE_OPERAND, OPERAND_TYPE_LIST } from '../constants';
import { appendOperand } from '../transformers/listOperand';
import {
	type AstNode,
	type JastListener,
	type JastVisitor,
	type ListOperand,
	type Operand,
	type Position,
} from '../types';

import { assignParent } from './common';

function acceptListOperand<Result>(this: ListOperand, visitor: JastVisitor<Result>) {
	return visitor.visitListOperand ? visitor.visitListOperand(this) : visitor.visitChildren(this);
}

function enterNode(this: ListOperand, listener: JastListener): void {
	listener.enterListOperand && listener.enterListOperand(this);
}

function exitNode(this: ListOperand, listener: JastListener): void {
	listener.exitListOperand && listener.exitListOperand(this);
}

function getChildren(this: ListOperand): AstNode[] {
	return [...this.values];
}

export const listOperand = (values: Operand[]): ListOperand => listOperandInternal(values);

export const listOperandInternal = (
	values: Operand[],
	position: Position | null = null,
): ListOperand => {
	const node: ListOperand = {
		type: NODE_TYPE_OPERAND,
		operandType: OPERAND_TYPE_LIST,
		values,
		position,
		accept: acceptListOperand,
		enterNode,
		exitNode,
		getChildren,
		parent: null,
		appendOperand,
	};

	assignParent(node);

	return node;
};
