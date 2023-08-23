import { NODE_TYPE_OPERAND, OPERAND_TYPE_FUNCTION } from '../constants';
import {
  Argument,
  AstNode,
  FunctionOperand,
  FunctionString,
  JastListener,
  JastVisitor,
  Position,
} from '../types';

import { assignParent } from './common';

function acceptFunctionOperand<Result>(
  this: FunctionOperand,
  visitor: JastVisitor<Result>,
) {
  return visitor.visitFunctionOperand
    ? visitor.visitFunctionOperand(this)
    : visitor.visitChildren(this);
}

function enterNode(this: FunctionOperand, listener: JastListener): void {
  listener.enterFunctionOperand && listener.enterFunctionOperand(this);
}

function exitNode(this: FunctionOperand, listener: JastListener): void {
  listener.exitFunctionOperand && listener.exitFunctionOperand(this);
}

function getChildren(this: FunctionOperand): AstNode[] {
  return [this.function, ...this.arguments];
}

export const functionOperand = (
  functionString: FunctionString,
  args: Argument[] = [],
): FunctionOperand => functionOperandInternal(functionString, args);

export const functionOperandInternal = (
  functionString: FunctionString,
  args: Argument[],
  position: Position | null = null,
): FunctionOperand => {
  const node: FunctionOperand = {
    type: NODE_TYPE_OPERAND,
    operandType: OPERAND_TYPE_FUNCTION,
    function: functionString,
    arguments: args,
    position,
    accept: acceptFunctionOperand,
    enterNode,
    exitNode,
    getChildren,
    parent: null,
  };

  assignParent(node);

  return node;
};
