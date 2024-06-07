import { NODE_TYPE_OPERAND, OPERAND_EMPTY, OPERAND_TYPE_KEYWORD } from '../constants';
import {
	type JastListener,
	type JastVisitor,
	type KeywordOperand,
	type KeywordOperandValue,
	type Position,
} from '../types';

import { noChildren } from './common';

function acceptKeywordOperand<Result>(this: KeywordOperand, visitor: JastVisitor<Result>) {
	return visitor.visitKeywordOperand
		? visitor.visitKeywordOperand(this)
		: visitor.visitChildren(this);
}

function enterNode(this: KeywordOperand, listener: JastListener): void {
	listener.enterKeywordOperand && listener.enterKeywordOperand(this);
}

function exitNode(this: KeywordOperand, listener: JastListener): void {
	listener.exitKeywordOperand && listener.exitKeywordOperand(this);
}

export const keywordOperand = (): KeywordOperand => keywordOperandInternal(OPERAND_EMPTY);

export const keywordOperandInternal = (
	value: KeywordOperandValue,
	position: Position | null = null,
): KeywordOperand => ({
	type: NODE_TYPE_OPERAND,
	operandType: OPERAND_TYPE_KEYWORD,
	value,
	position,
	accept: acceptKeywordOperand,
	enterNode,
	exitNode,
	getChildren: noChildren,
	parent: null,
});
