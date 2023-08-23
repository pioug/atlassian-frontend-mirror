import {
  JastListener,
  JastVisitor,
  Operator,
  OperatorValue,
  Position,
} from '../types';

import { noChildren } from './common';

function acceptOperator<Result>(this: Operator, visitor: JastVisitor<Result>) {
  return visitor.visitOperator
    ? visitor.visitOperator(this)
    : visitor.visitChildren(this);
}

function enterNode(this: Operator, listener: JastListener): void {
  listener.enterOperator && listener.enterOperator(this);
}

function exitNode(this: Operator, listener: JastListener): void {
  listener.exitOperator && listener.exitOperator(this);
}

export const operator = (value: OperatorValue): Operator =>
  operatorInternal(value, value);

export const operatorInternal = (
  value: OperatorValue,
  text: string,
  position: Position | null = null,
): Operator => ({
  text,
  value,
  position,
  accept: acceptOperator,
  enterNode,
  exitNode,
  getChildren: noChildren,
  parent: null,
});
